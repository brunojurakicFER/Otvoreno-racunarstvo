import React from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const ProtectedApi = () => {
  const { getAccessTokenSilently } = useAuth0();

  const callProtectedApi = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get("http://localhost:3000/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return <button onClick={callProtectedApi}>Call Protected API</button>;
};

export default ProtectedApi;
