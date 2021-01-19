import { gql, useMutation, useQuery } from "@apollo/client";
import { Button, Container, TextField } from "@material-ui/core";
import React, { useState } from "react";
import Loading from "../Components/Loading"
import "./style.css";

// This query is executed at runtime by apollo client

const GET_BOOKMARK = gql`
  query {
    bookmarks {
      id
      title
      url
    }
  }
`;

const DELETE_BOOKMARK = gql `
  mutation deleteBookmark($id:String!){
    deleteBookmark(id:$id){
      id
    }
  }
`

const ADD_BOOKMARK = gql`
  mutation addBookmark($title: String!, $url: String!) {
    addBookmark(title: $title, url: $url) {
      id
    }
  }
`;



const IndexPage = () => {
  const [input, setInput] = useState("");
  const [url, setUrl] = useState("");
  const [addBookmark] = useMutation(ADD_BOOKMARK);
  const [deleteBookmark] = useMutation((DELETE_BOOKMARK));
  const { loading, error, data } = useQuery(GET_BOOKMARK);

  // function for adding bookmark in database througn graphql
  const handleBookmark = async () => {
    addBookmark({
      variables: {
        title: input,
        url: url,
      },
      refetchQueries: [{ query: GET_BOOKMARK }],
    });
    setUrl(" ");
    setInput(" ");
  };

  

  return (
    <div className="Bookmark_container">
      <Container maxWidth="xs">
        <div className="Bookmark_wrapper">
          <div className = "Bookmark_heading" >
            <h3>Bookmark</h3>
          </div>
          <div className="Bookmark_title-field">
            <TextField
              label="Bookmark Title"
              variant="outlined"
              color="primary"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />
          </div>
          <div className="Bookmark_url-field">
            <TextField
              label="Bookmark Url"
              variant="outlined"
              color="primary"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
              }}
            />

            <div className="Bookmark_button">
            <Button
              disabled={input.length < 4 || url.length < 4}
              variant="outlined"
              color="primary"
              onClick={() => {
                handleBookmark()
                
              } }
            >
              Add Bookmark
            </Button>
          </div>

          </div>

         
        </div>
      </Container>

      <div className="BookmarkList_container">
        <div className="BookmarkList_wrapper">
          {loading ? <Loading/> : null}
          {error ? <h1>Error</h1> : null}
          {/* {data && <h1>{JSON.stringify(data.bookmarks)}</h1> } */}
          {data && 
            data.bookmarks.map((bm) => {
              return (
                <Container maxWidth = "md" key={bm.id} >
                <div  className="Bookmark_list">
                  <div className="Bookmark_title">
                    <h2>{bm.title}</h2>
                  </div>
                  <div className="Bookmark_url">
                    <h4>{bm.url}</h4>
                  </div>
                  <div className="Bookmark_delete">
                    <button onClick = {async () => {
                      deleteBookmark({
                        variables : {
                          id : bm.id
                        } , 
                        refetchQueries : [{query : GET_BOOKMARK}]
                      })
                    }} >Delete</button>
                    </div>
                    
                </div>
                </Container>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
