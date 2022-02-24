const sleep = (s: number) => new Promise(resolve => setTimeout(resolve, s * 1000));
export default sleep;
