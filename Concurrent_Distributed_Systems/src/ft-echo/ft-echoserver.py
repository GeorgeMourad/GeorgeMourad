from kazoo.client import KazooClient
from kazoo.client import KazooState
import threading
import socket
def my_listener(state):	
	if state == KazooState.LOST:
		lostsus = True
		print("Connection Lost/Closed")
	elif state == KazooState.SUSPENDED:
		lostsus = True
		print("Connection Suspended")
	else:
		print("Connected to Zookeeper")
HOST = "127.0.0.1"         
print("Enter a number between 1 and 100")
my_id = input()

my_id_str = my_id.encode('utf-8')
# Echo server should listen on port 1023 + myid
echoport = 1023+int(my_id)

zk = KazooClient(hosts='localhost:2181')
zk.add_listener(my_listener)
zk.start()

lostsus = True
leaderNode = threading.Event()
flag = True
@zk.DataWatch("/master")
def wakeUp(data,stat,event):
	global flag
	if(event != None and event.type == "DELETED"):
		stat = zk.exists("/master")
		if(stat != None and stat.ephemeralOwner != zk.client_id[0]): 	
			flag = False
			print(flag)
			return
		print(event)
		print("Setting leaderNode")
		leaderNode.set()
# add your logic
while True:
	try:
		zk.create("/master", str(echoport).encode('utf-8'), ephemeral= True)
		print("I am master")
		flag = True
		with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
			s.settimeout(2)
			s.bind((HOST, echoport))
			s.listen()
			while flag:
				try:
					conn, addr = s.accept()
				except:
					stat = zk.exists("/master")
					if(lostsus and stat != None and stat.ephemeralOwner != zk.client_id[0]): 	
						flag = False
						print(flag)
					print("Timeout")
					continue
				with conn:
					print('Connected by', addr)
					while True:
						data = conn.recv(1024)
						if not data:
							break
						conn.sendall(data)
	except Exception as e:
		print(e.with_traceback)
		print("Waiting for election")
		leaderNode.wait()
		leaderNode.clear()
# The primary echo server does its work here	

zk.stop()