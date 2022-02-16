const base = 'https://rs-lang-bckend.herokuapp.com';
const words = `${base}/words`;

export const getWords = async (group: number, page: number) => {
  const response = await fetch(`${words}?group=${group}&page=${page}`, {
    method: 'GET'
  });

  return response.json();
};
