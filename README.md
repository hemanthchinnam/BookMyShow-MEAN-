Steps to Run the project:
	Clone the project into your system/machine using the repository link.
	Use the below command to clone
			git clone https://github.com/hemanthchinnam/BookMyShow-MEAN-.git
	
After cloning succesfully,
			Rename the .env.example into .env
	
Now run the following commands in your VS.code terminal,
		split the terminal into to two one for running backend and one for frontend.

	
		cd backend 	
		npm install
similarly in other splitted terminal part

		cd frontend
		npm install

Note: Need to start "monogd" before starting the project in order to successfully connect to the database.You can simply start by typing "mongod" in your command prompt.

 now execute the command -
 	
       npm start 
in both the terminal parts to start backend and frontend respectively.

In utils.js Give "your Email Id" and "Your Pass Key" from google

After starting you can view the output in your browser running on "http://localhost:4200/".
