const {ApolloServer , gql}  =  require("apollo-server-lambda");
const faunadb = require("faunadb");
const q = faunadb.query;
const dotenv = require("dotenv")
dotenv.config();


const typeDefs = gql `

    type Query {
      bookmarks : [Bookmark!]
    }

    type Mutation {
      addBookmark(title : String! , url: String!):Bookmark
      deleteBookmark(id:String!):Bookmark
    }

    type Bookmark {
      id : ID
      title : String
      url : String
    }

`

const resolvers = {

  Query : {
    bookmarks : async (root , args , context) => {
      try {
        
        const client = new faunadb.Client({secret:process.env.FAUNDDB_SECRET_KEY});
        console.log("connection established");
        const result = await client.query(
          q.Map(
            q.Paginate(q.Documents(q.Collection("bookmarks"))),
            q.Lambda((x) => q.Get(x))
          )
        
        );
        console.log(result.data)
        
        return result.data.map(d => {
          return {
            id : d.ref.id,
            title : d.data.title,
            url : d.data.url
          }
        })

        
      }

      catch(err){
        console.log(`ERROR ${err}`)
      }
    }
  },

  Mutation : {
    addBookmark : async (_ , {title , url}) => {
      console.log(`Title || ${title} && URL ||| ${url}`)
      try{

        const client = new faunadb.Client({secret:process.env.FAUNDDB_SECRET_KEY});
        console.log("connection established");
        const result = await client.query(
          q.Create(q.Collection("bookmarks") , {
            data : {
              title : title,
              url : url
            }
          } )
        )
        // console.log(`Result ||| ${JSON.parse(result.data)}`);
      }

      catch(err){
        console.log(`Error ${err}`)
      }
    },

    deleteBookmark: async (_ , {id}) => {
      console.log(`ID : ${id}`)
      try {
        const client = new faunadb.Client({secret:process.env.FAUNDDB_SECRET_KEY});
        console.log("connection established");

        const result = await client.query(
          q.Delete(q.Ref(q.Collection("bookmarks") , id ))
        )
        // console.log("result" , result)
      }
      catch(err){
        console.log(err)
      }
    }

  },

};


const server = new ApolloServer({

  typeDefs,
  resolvers,
});

const handler = server.createHandler();

module.exports = {handler}