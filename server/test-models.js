const fetchModels = async () => {
  const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyBI5rc9W_0KdZyFlqGqOzQMKM7QBMlzMVQ");
  const data = await res.json();
  console.log(data.models.map(m => m.name));
}
fetchModels();
