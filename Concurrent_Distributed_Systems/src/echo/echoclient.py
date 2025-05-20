import socket
from kazoo.client import KazooClient
from kazoo.client import KazooState
HOST = "127.0.0.1"  # The server's hostname or IP address




def my_listener(state):	
    if state == KazooState.LOST:
        print("Connection Lost/Closed")
    elif state == KazooState.SUSPENDED:
        print("Connection Suspended")
    else:
        print("Connected to Zookeeper")
            
zk = KazooClient(hosts='localhost:2181')
zk.add_listener(my_listener)
zk.start()
PORT,stat = zk.get("/master") # The port used by the server
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect((HOST, int(PORT.decode("utf-8"))))
    s.sendall(b"Hello, world")
    data = s.recv(1024)

print(f"Received {data!r}")

