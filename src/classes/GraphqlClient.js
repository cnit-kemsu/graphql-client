class GraphqlError extends Error {
  constructor(errors) {
    super(errors?.[0]?.message);
    this.errors = errors;
  }
}

export class GraphqlClient {

  headers = {};

  constructor(url) {
    this.url = url;
  }

  async fetch(body) {

    try {

      const responce = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.headers
        },
        body: JSON.stringify(body)
      });
  
      const result = await responce.json();
      if (responce.status !== 200) throw new GraphqlError(result.errors);
      return result.data;

    } catch (error) {
      throw new GraphqlError([error]);
    }
    
  }
}
