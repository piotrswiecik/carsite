# Deployment notes

## Local setup

Dockerizing Next app - you must use standalone mode in next config.  

Configuring network locally is tricky. Option one is to use a hacky workaround by adding fake identity server
domain to /etc/hosts. You also need to use separate vars for NEXTAUTH_URL and NEXTAUTH_URL_INTERNAL. The second one is
used by all server side calls - they will go to "docker-relevant" address, while client side calls with be directed to
localhost so that they work inside the browser. 

mkcert - used for docker ingress.
```bash
mkcert -install
mkcert -key-file carsite.com.key -cert-file carsite.com.crt app.carsite.com api.carsite.com id.carsite.com

```