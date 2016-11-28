cd ./CS172-Tweet-Collector
mvn clean install
mvn exec:java -Dexec.mainClass="Part2.QueryLucene" -Dexec.args="\"$1\" " | sed '1,/~HITS~/d'
cd ..
