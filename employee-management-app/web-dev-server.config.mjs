export default { 
  nodeResolve: true,
  open: true,
  watch: true,
  appIndex: 'index.html', 
  plugins: [],
  middleware: [
      function historyFallback(ctx, next) {
          return next().catch(() => {
              ctx.status = 200;
              ctx.url = '/index.html'; 
              return next();
          });
      }
  ]
};