# file: rfcomm-server.py
# Auth: Lucas Speer f
# Based on code by: Albert Huang <albert@csail.mit.edu>
# desc: simple demonstration of a server application that uses RFCOMM sockets
# for use with github.com/lucasspeer/SeniorDesignSmartMirror
# $Id: rfcomm-server.py 518 2007-08-10 07:20:07Z albert $

from bluetooth import *
import os

# Set up the bluetooth socket as a server
server_sock=BluetoothSocket( RFCOMM )
server_sock.bind(("",PORT_ANY))
server_sock.listen(1)

port = server_sock.getsockname()[1]
# Must be the same as the Android app
uuid = "94f39d29-7d6d-437d-973b-fba39e49d4ee"

advertise_service( server_sock, "SmartMirror",
                   service_id = uuid,
                   service_classes = [ uuid, SERIAL_PORT_CLASS ],
                   profiles = [ SERIAL_PORT_PROFILE ], 
#                   protocols = [ OBEX_UUID ] 
                    )
                    
	
def dataHandler(data):
	setFile = open('config.json', 'w')
	setFile.write(data)			#Overrite any data with as neccesarry and save
	print(data)
	data = ""
	setFile.close()

def wifiHandler(data):
	wifiArr = data.split("\n"); #split the data on the return key to get ssid and key seperate
	strToSend = "sudo iwconfig wpa0 " + wifiArr[0] + " " + wifiArr[1]
	os.system(strTroSend)
	
wifiFile = open('wifilist.save', 'r')
wifi = wifiFile.read()
while True:                   
	print("Waiting for connection on RFCOMM channel %d" % port)

	client_sock, client_info = server_sock.accept()		#Accept incoming connections
	print("Accepted connection from ", client_info)
	if wifi != "Connected":
		try:
			client_sock.send(wifi)
		except IOError:
			pass
	try:
		while True:
			data = client_sock.recv(1024)
			if len(data) == 0: break
			if len(data) > 20:
				dataHandler(data)
			else:
				wifiHandler(data)
	except IOError:
		pass

