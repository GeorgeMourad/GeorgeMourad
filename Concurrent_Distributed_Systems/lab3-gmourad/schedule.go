package mapreduce

import (
	"sync"
)

// schedule starts and waits for all tasks in the given phase (Map or Reduce).
func (mr *Master) schedule(phase jobPhase) {
	var ntasks int
	var nios int // number of inputs (for reduce) or outputs (for map)
	switch phase {
	case mapPhase:
		ntasks = len(mr.files)
		nios = mr.nReduce
	case reducePhase:
		ntasks = mr.nReduce
		nios = len(mr.files)
	}

	debug("Schedule: %v %v tasks (%d I/Os)\n", ntasks, phase, nios)

	// All ntasks tasks have to be scheduled on workers, and only once all of
	// them have been completed successfully should the function return.
	// Remember that workers may fail, and that any given worker may finish
	// multiple tasks.
	//
	// TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO
	//
	var wg sync.WaitGroup
	wg.Add(ntasks)
	for i := range ntasks {
		go call1(mr.jobName, mr.arg, mr.files[i], phase, i, nios, mr, &wg)
	}
	wg.Wait()
	debug("Schedule: %v phase done\n", phase)
}

func call1(JobName string, InputArg string, File string, Phase jobPhase, TaskNumber int, Nios int, mr *Master, wg *sync.WaitGroup) {
	tempWorker := <-mr.registerChannel
	args := DoTaskArgs{JobName, InputArg, File, Phase, TaskNumber, Nios}
	if !call(tempWorker, "Worker.DoTask", args, nil) {
		call1(JobName, InputArg, File, Phase, TaskNumber, Nios, mr, wg)
		return
	}
	wg.Done()
	mr.registerChannel <- tempWorker
}
