package mapreduce

import (
	"encoding/json"
	"os"
	"sort"
)
// doReduce does the job of a reduce worker: it reads the intermediate
// key/value pairs (produced by the map phase) for this task, sorts the
// intermediate key/value pairs by key, calls the user-defined reduce function
// (reduceF) for each key, and writes the output to disk.
func doReduce(
	jobName string,       // the name of the whole MapReduce job
	reduceTaskNumber int, // which reduce task this is
	nMap int,             // the number of map tasks that were run ("M" in the paper)
	reduceF func(key string, values []string) string,
	) {
	var keyValues []KeyValue
	for i := range(nMap){
		filename := reduceName(jobName,i,reduceTaskNumber)
		file, err := os.Open(filename)
		checkError(err)	
		defer file.Close()
		decoder := json.NewDecoder(file)
		for {
			var keyValue KeyValue
			err := decoder.Decode(&keyValue)
			if(err != nil) {break}
			keyValues = append(keyValues, keyValue)
		} 
	}
		sort.Slice(keyValues, func(i, j int) bool {
			return keyValues[i].Key < keyValues[j].Key
		})
		out,err := os.Create(mergeName(jobName, reduceTaskNumber))
		checkError(err)
		defer out.Close()
		var values []string
		currKey := ""
		enc := json.NewEncoder(out)
		for _,keyValue := range(keyValues){
			if(currKey == "") {
				currKey = keyValue.Key
			}
			if(keyValue.Key != currKey) {
				err = enc.Encode(KeyValue{currKey,reduceF(currKey, values)})
				checkError(err)
				currKey = keyValue.Key
				values = nil
			}
			values = append(values, keyValue.Value)
		}
		err = enc.Encode(KeyValue{currKey,reduceF(currKey, values)})
		checkError(err)
		
		
	// TODO:
	// You will need to write this function.
	// You can find the intermediate file for this reduce task from map task number
	// m using reduceName(jobName, m, reduceTaskNumber).
	// Remember that you've encoded the values in the intermediate files, so you
	// will need to decode them. If you chose to use JSON, you can read out
	// multiple decoded values by creating a decoder, and then repeatedly calling
	// .Decode() on it until Decode() returns an error.
	//
	// You should write the reduced output in as JSON encoded KeyValue
	// objects to a file named mergeName(jobName, reduceTaskNumber). We require
	// you to use JSON here because that is what the merger than combines the
	// output from all the reduce tasks expects. There is nothing "special" about
	// JSON -- it is just the marshalling`` format we chose to use. It will look
	// something like this:
	//
	// enc := json.NewEncoder(mergeFile)
	// for key in ... {
	// 	enc.Encode(KeyValue{key, reduceF(...)})
	// }
	// file.Close()
	//
	// Use checkError to handle errors.


}
