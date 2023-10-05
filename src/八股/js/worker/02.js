console.log('worker');
this.onmessage = (e) => {
  console.log(e.data);
}