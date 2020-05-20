const BASE_URL = '/api/words';

const searchWord = () => {
    let id = document.getElementById("id").value;
    getWord(id);
}

const getWord = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/find/${id}`);
    const word = res.data;
    console.log(`GET: Here's the word`, word);
    document.getElementById("result").innerHTML = JSON.stringify(word, null, 2);

  } catch (e) {
    console.error(e);
  }
};

