# syntax=docker/dockerfile:1
FROM node:22.12.0-alpine3.21

WORKDIR /app

ENV PORT=3001

COPY --chown=node:node package.json server.js ./

USER node

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]
