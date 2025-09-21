Launch Live Streaming Server
go build ./cmd/signal/json-rpc/main.go ; ./main -c config.toml

Set up TURN Server (Using coturn)
https://yuanchieh.page/posts/2020-09-21_aws-coturn-server-%E6%9E%B6%E8%A8%AD%E6%95%99%E5%AD%B8/

sudo service coturn stop

forever start -c "sudo turnserver -v --lt-cred-mech --user hello:world --realm turn.bidcast.online --external-ip 54.251.210.79" .

404 html
https://imgflip.com/i/5ru98i

turn off ad block
https://imgflip.com/i/5ru9jw

lsof -i :<port>

存取金鑰 ID
AKIAT4O2C2DWF23JMNFK

私密存取金鑰
723Ju68pBR3NFsUevEd8HJ4XPzzs9jeBbQfEPlB3

sudo docker-compose build
docker-compose --env-file envfile up -d

docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' bidcast_db_1
