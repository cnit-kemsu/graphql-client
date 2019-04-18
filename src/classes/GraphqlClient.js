class GraphqlError extends Error {
  constructor(errors) {
    super(errors?.[0]?.message);
    this.name = 'GraphqlError';
    this.errors = errors;
  }
}

export class GraphqlClient {

  headers = {};

  constructor(url) {
    this.url = url;
  }

  async fetch(body) {

    const formData  = new FormData();
    formData.append('query', body.query);
    formData.append('variables', JSON.stringify(body.variables));

    try {

      const responce = await fetch(this.url, {
        method: 'POST',
        headers: {
          //'Content-Type': 'application/json',
          //'Content-Type': 'multipart/form-data',
          'X-Requested-With': 'XMLHttpRequest',
          ...this.headers
        },
        body: formData,
        //body
      });
  
      const result = await responce.json();
      if (responce.status !== 200 || result.errors !== undefined) throw new GraphqlError(result.errors);
      return result.data;

    } catch (error) {
      if (error.name === 'GraphqlError') throw error;
      else throw new GraphqlError([error]);
    }
    
  }
}
