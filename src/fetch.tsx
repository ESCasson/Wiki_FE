const postData = async (query: string, variables?: any) => {
  const input = { query, variables };

  const response = await fetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = await response.json();
  return data;
};

export default postData;
