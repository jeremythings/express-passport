sudo openssl genrsa -out key.pem 2048
sudo openssl req -new -x509 -key key.pem -out cert.pem -days 1095

