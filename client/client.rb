require "net/http"
require "uri"
require "json"

terminalLoop = true;

while terminalLoop do
	puts "Enter zipcode"

	zipcode = gets

	if zipcode.chomp.eql? "exit"
		puts "exiting"
		terminalLoop = false;
	else
		uri = URI.parse("http://34.205.30.130:3000/ziptocbsa/"+zipcode.chomp.to_s)
		response = Net::HTTP.get_response(uri)
		data = JSON.parse(response.body)
		puts
		
		if data.count != 0	
			puts "Zipcode        : " + data["zip"].to_s
			puts "CBSA           : " + data["cbsa"].to_s
			puts "MSA            : " + data["msa"].to_s
			puts "popestimate2014: " + data["popestimate2014"].to_s
			puts "popestimate2015: " + data["popestimate2015"].to_s
		else 
			puts "No data found"
		end 

		puts
	end
	
end