const names = [
  "Disha Patani",
  "Nora Fatehi",
  "Sunny Leone",
  "Mouni Roy",
  "Kiara Advani",
  "Urvashi Rautela",
  "Janhvi Kapoor",
  "Pooja Hegde",
  "Jacqueline Fernandez",
  "Shruti Haasan",
  "Samantha Ruth Prabhu",
  "Tamannaah Bhatia",
  "Kriti Sanon"
];

async function run() {
  for (const name of names) {
    try {
      const res = await fetch(`http://localhost:3000/api/meta-data/tmdb/search?query=${encodeURIComponent(name)}`);
      const data = await res.json();
      const person = data.results.find(r => r.media_type === 'person');
      if (person) {
         console.log(`{ name: '${name}', tmdbId: ${person.id}, imageUrl: 'https://image.tmdb.org/t/p/w185${person.profile_path}' },`);
      }
    } catch(e) {
      console.log(e.message);
    }
  }
}
run();
