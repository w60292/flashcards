export async function GET() {
  const data = [
    { id: 1, word: 'what', date: '2023/10/24' },
    { id: 2, word: 'hey', date: '2023/10/24' },
    { id: 3, word: 'morning', date: '2023/10/24' },
    { id: 4, word: 'good', date: '2023/10/24' },
    { id: 5, word: 'help', date: '2023/10/24' },
    { id: 6, word: 'come', date: '2023/10/24' },
    { id: 7, word: 'here', date: '2023/10/24' },
    { id: 8, word: 'my', date: '2023/10/24' },
    { id: 9, word: 'find', date: '2023/10/24' },
    { id: 10, word: 'dog', date: '2023/10/24' },
    { id: 11, word: 'thank', date: '2023/10/24' },
    { id: 12, word: 'you', date: '2023/10/24' },
    { id: 13, word: 'welcome', date: '2023/10/24' },
  ];

  const dataWithSyllables = await Promise.all(data.map(async item => {
    const result = await fetch(`https://api-portal.dictionary.com/dcom/pageData/${item.word}`)
      .then(res => res.json())
      .then(jsonObj => jsonObj.data.content.shift().entries.shift().entrySyllabified);

    return {
      ...item,
      syllables: result.split('·').join('-'),
    };
  }));
  
  return Response.json({ success: true, data: dataWithSyllables });
}
