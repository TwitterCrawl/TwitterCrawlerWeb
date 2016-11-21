cd /home/coldnighthour/Documents/CS172/CS172-Tweet-Collector/
mvn clean install
mvn exec:java -Dexec.mainClass="Part2.QueryLucene" | sed '1,/FOUND/d'
cd /home/coldnighthour/Documents/CS172/TwitterCrawlerWeb/
