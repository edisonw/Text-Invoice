#!/bin/bash
#sudo chomd 777 this script. then sudo it. 
read -p "Do you want to check for requirements first?[Yes]/Skip? " input
responsta=${input:-Yes}
if [[ "${responsta:0:1}" != "Y" && "${responsta:0:1}" != "y" ]];
then
	echo "Skipping Package Mangement Checks."
else
echo "Checking Homebrew (Update/Install)"
if /usr/bin/ruby -e "$(curl -fsSL https://raw.github.com/gist/323731)"
then 
	echo "Successfully installed Homebrew!"
else
	echo "Installation of Homebrew Failed. For non-Mac users, this is fine."
	echo "Checking Git Installation by initializing Git."
	if git init ~/test_edison_git
	then 
		echo "Git test successful"
		rm -R ~/test_edison_git
	else
		echo "Git is also not here"
		echo "Switch to Ubuntu Mode"
		if sudo apt-get install git
		then 
			echo "Successfully installed git"
		else
			echo "Switch to Fedora Mode"
			if sudo yum install git
			then
				echo "Successfully installed git"
			else
				echo "Git Might be required. The installation may fail."
			fi
		fi
	fi
fi
fi
read -p "Continue Installing Node?[Yes]/Skip? " input
responsta=${input:-Yes}
if [[ "${responsta:0:1}" != "Y" && "${responsta:0:1}" != "y" ]];
then
	echo "Skipping Node Installation."
else
	if brew install node
	then 
		echo "Successfully installed node from Homebrew!"
	else
		echo "Switch to Ubuntu Mode."
		if sudo apt-get install python-software-properties
		then
			sudo add-apt-repository ppa:chris-lea/node.js
			sudo apt-get update
			sudo apt-get install nodejs
		else
			if git clone git://github.com/joyent/node.git
			then 
				make
				make install
				echo "Successfully installed node from source.!"
				cd node
				mkdir ~/local
				./configure --prefix=$HOME/local/node
				echo 'export PATH=$HOME/local/node/bin:$PATH' >> ~/.profile
				echo 'export NODE_PATH=$HOME/local/node:$HOME/local/node/lib/node_modules' >> ~/.profile
				source ~/.profile
				cd ..
			else
				echo "Cannot install node!"
				exit $?
			fi
		fi
	fi
	curl http://npmjs.org/install.sh | sh
fi
read -p "Continue Installing MongoDB?[Yes]/Skip? " input
responsta=${input:-Yes}
if [[ "${responsta:0:1}" != "Y" && "${responsta:0:1}" != "y" ]];
then
	echo "Skipping MongoDB Installation."
else
echo "3. Installing MongoDB..."
	if brew install mongodb
	then
		echo "Successfully installed mongodb!"
	else
		echo "Switch to Ubuntu Mode."
		if sudo apt-get install mongodb-stable
		then
			echo "Successfully installed mongodb!"
		else
			echo "Switch to Fedora Mode"
			sudo yum -y install git tcsh scons gcc-c++ glibc-devel
			sudo yum -y install boost-devel pcre-devel js-devel readline-devel
			sudo yum -y install boost-devel-static readline-static ncurses-static
			git clone git://github.com/mongodb/mongo.git
			cd mongo
			git tag -l
			git checkout r1.4.1
			if scons all
			then
				scons --prefix=/opt/mongo install
				echo "It worked!"
			else
				echo "Failed to install mongodb!"
				exit $?
			fi
		fi
	fi
fi
read -p "Continue Installing App?[Yes]/Skip? " input
responsta=${input:-Yes}
if [[ "${responsta:0:1}" != "Y" && "${responsta:0:1}" != "y" ]];
then
	echo "Skipping App Installation."
else
	echo "If you have permission from, this will download the version 1 of the code, else please ignore the rest and use the code from P4V"
	if git clone git@github.com:wzsddtc2/Quickbooks-China.git
	then
		cd Quickbooks-China
		npm install -g express
		npm install -d
		npm install -g run
		mongod
		echo "Now running the app!"
		runjs ./app.js
	else
		echo "You may now sudo app.js in the code."
	fi
fi