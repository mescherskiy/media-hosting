import React from "react";

import { useGetAdminBoardQuery } from "../api/api";

const AdminBoard = () => {

  const { data: response, isError, error, isLoading } = useGetAdminBoardQuery();

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error! {error.data.message}</div>
  if (!response) return <div>Content is missing!</div>

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{response.message}</h3>
      </header>
    </div>
  );
};

export default AdminBoard;