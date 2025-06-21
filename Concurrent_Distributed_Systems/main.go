package main

/*
Design
Vehicle types: Car is False, Truck is True
Direction: South is False, North is True
*/
import (
	"fmt"
	"math/rand"
	"sync"
	"time"
)

var nVeh queue
var sVeh queue
var weight int
var currDirection string
var waitCount int
var mu sync.Mutex
var bridge []vehicle
var wg sync.WaitGroup

// vehicle thread
func OneVehicle(veh_id int, veh_type string, direction string) {
	vehicle := vehicle{veh_id, veh_type, direction, sync.NewCond(&mu)}
	Arrive(vehicle)
	Cross(vehicle)
	Leave(vehicle)
	wg.Done()
}

// vehcile arrives and must be inserted in corresponding directional bridge queue
func Arrive(veh vehicle) {
	mu.Lock()
	if currDirection == "" || ((len(nVeh.vehicles) == 0) && len(sVeh.vehicles) == 0 && len(bridge) == 0) {
		currDirection = veh.direction
	}
	switch veh.direction {
	case "Southbound":
		sVeh.vehicles = append(sVeh.vehicles, veh)
		if currDirection == "Northbound" && sVeh.vehicles[0].id == veh.id {
			waitCount = len(bridge)
		}
	case "Northbound":
		nVeh.vehicles = append(nVeh.vehicles, veh)
		if currDirection == "Southbound" && nVeh.vehicles[0].id == veh.id {
			waitCount = len(bridge)
		}
	}
	fmt.Print("Vehicle #", veh.id, "(", veh.direction, ", Type: ", veh.vtype, ") arrived.\n\n")
	mu.Unlock()
}

// vehicle must determine whether or not it is capable of crossing
// once it has the permission to cross, vehicle will cross the bridge
// Conditions to check:
// has the vehicle in the opposite direction waited for at most 6 cars to cross
// is the weight of the bridge with the current vehicle added
// is the direction of traffic in the same direction
func Cross(veh vehicle) {
	//bridge weight
	mu.Lock()
	//check if this vehicle can be on the bridge
	for (veh.direction == "Northbound" && len(nVeh.vehicles) != 0 && veh.id != nVeh.vehicles[0].id) || (veh.direction == "Southbound" && len(sVeh.vehicles) != 0 && veh.id != sVeh.vehicles[0].id) || (veh.vtype == "Car" && (weight+100) > 750) || (veh.vtype == "Truck" && (weight+300) > 750) || (veh.direction != currDirection) || (waitCount > 5) {
		printArr(sVeh.vehicles, "Southbound", true)
		printArr(nVeh.vehicles, "Northbound", true)
		veh.cv.Wait()
	}
	//check if there is any vehicles in the opposite direction that are waiting and if so, increment their wait count
	if (currDirection == "Southbound") && (len(nVeh.vehicles) != 0) {
		waitCount++
	} else if (currDirection == "Northbound") && (len(sVeh.vehicles) != 0) {
		waitCount++
	}
	fmt.Print("Vehicle #", veh.id, " is now crossing the bridge.\n\n")
	//dequeue vehicle and signal next potential vehicle to cross
	if veh.direction == "Southbound" {
		bridge = append(bridge, sVeh.vehicles[0])
		sVeh.vehicles = sVeh.vehicles[1:]
		if len(sVeh.vehicles) != 0 {
			sVeh.vehicles[0].cv.Signal()
		}
	} else if veh.direction == "Northbound" {
		bridge = append(bridge, nVeh.vehicles[0])
		nVeh.vehicles = nVeh.vehicles[1:]
		if len(nVeh.vehicles) != 0 {
			nVeh.vehicles[0].cv.Signal()
		}
	}
	//add weight to bridge once crossing
	if veh.vtype == "Car" {
		weight += 100
	} else if veh.vtype == "Truck" {
		weight += 300
	}
	printArr(bridge, "N/A", false)
	mu.Unlock()
	time.Sleep(2 * time.Second)
}

func Leave(veh vehicle) {
	mu.Lock()
	//remove weight from bridge
	if veh.vtype == "Car" {
		weight -= 100
	} else if veh.vtype == "Truck" {
		weight -= 300
	}
	//remove leaving vehicle from the bridge
	fmt.Print("Vehicle #", veh.id, " exited the bridge. Total Weight:", weight, "\n\n")
	for i := 0; i < len(bridge); i++ {
		if veh.id == bridge[i].id {
			bridge = append(bridge[:i], bridge[i+1:]...)
		}
	}
	//check if the other side has waited too long and if so switch direction
	if waitCount > 5 && len(bridge) == 0 {
		waitCount = 0
		if currDirection == "Southbound" {
			currDirection = "Northbound"
			nVeh.vehicles[0].cv.Signal()
		} else {
			currDirection = "Southbound"
			sVeh.vehicles[0].cv.Signal()
		}
		//check if there are any vehicles behind to cross, if not signal the opposite direction
	} else if veh.direction == "Southbound" && len(sVeh.vehicles) != 0 {
		sVeh.vehicles[0].cv.Signal()
	} else if veh.direction == "Northbound" && len(nVeh.vehicles) != 0 {
		nVeh.vehicles[0].cv.Signal()
	} else if veh.direction == "Southbound" && len(nVeh.vehicles) != 0 && len(bridge) == 0 {
		currDirection = "Northbound"
		nVeh.vehicles[0].cv.Signal()
	} else if veh.direction == "Northbound" && len(sVeh.vehicles) != 0 && len(bridge) == 0 {
		currDirection = "Southbound"
		sVeh.vehicles[0].cv.Signal()
	}

	mu.Unlock()
}

// print the current status of the vehicles crossing or on the bridge
// if wait is true, print the current waiting status of the array
// if wait is false, print the vehicles on the bridge
func printArr(vehicles []vehicle, direction string, wait bool) {
	if len(vehicles) == 0 {
		if wait {
			if currDirection == "Southbound" {
				fmt.Print("Waiting vehicles (", direction, "): []\n")
			} else if currDirection == "Northbound" {
				fmt.Print("Waiting vehicles (", direction, "): []\n\n")
			}
		} else {
			fmt.Println("Vehicles on the bridge: []")
		}
		return
	}
	if wait {
		fmt.Print("Waiting vehicles (", vehicles[0].direction, "): [")
		for i := 0; i < len(vehicles); i++ {
			if i != len(vehicles)-1 {
				fmt.Print("#", vehicles[i].id, " (Type: ", vehicles[i].vtype, "), ")
			} else {
				fmt.Print("#", vehicles[i].id, "(Type: ", vehicles[i].vtype, ")")
			}
		}
		fmt.Print("]\n\n")
	} else {
		fmt.Print("Vehicles on the bridge: [")
		for i := 0; i < len(vehicles); i++ {
			if i != len(vehicles)-1 {
				fmt.Print("#", vehicles[i].id, "(", vehicles[i].direction, ", Type: ", vehicles[i].vtype, "), ")
			} else {
				fmt.Print("#", vehicles[i].id, "(", vehicles[i].direction, ", Type: ", vehicles[i].vtype, ")")
			}
		}
		fmt.Print("]. Total Weight:", weight, "\n\n")
	}

}

type vehicle struct {
	id        int
	vtype     string
	direction string
	cv        *sync.Cond
}
type queue struct {
	vehicles []vehicle
}
type Tuple struct {
	groupSize int
	delay     int
}

func main() {
	// Input number of groups
	var numgroups int
	for numgroups < 1 {
		fmt.Print("Enter number of groups (Must be greater than 0): ")
		fmt.Scanln(&numgroups)
	}
	fmt.Println("Number of groups", numgroups)
	group := make([]Tuple, numgroups)

	//input the number of groups and corresponding delays
	for i := 0; i < numgroups; i++ {
		for group[i].groupSize == 0 {
			fmt.Println("Input group", i+1, "size: ")
			fmt.Scanln(&group[i].groupSize)
		}
		if i != numgroups-1 {
			fmt.Println("Input delay for group", i+1, ": ")
			fmt.Scanln(&group[i].delay)
		}
	}

	//input percentages for direction and vehicle type
	var sPerc, carPerc float32 = -1, -1
	//default input for direction should be 0.50
	for sPerc < 0 || sPerc > 1 {
		fmt.Print("Enter Chance for South Direction (Must be between 0.0 - 1.0 and North direction chance will be corresponding value): ")
		fmt.Scanln(&sPerc)
	}

	for carPerc < 0 || carPerc > 1 {
		fmt.Print("Enter Chance for type to be a Car (Must be between 0.0 - 1.0 and Truck Chance will be corresponding value): ")
		fmt.Scanln(&carPerc)
	}

	//Send each group through the bridge
	//i iterates through each group in the expirement
	vehIDcounter := 1
	random := rand.New(rand.NewSource(2))
	for i := 0; i < numgroups; i++ {
		//create vehicles in currect group with randomly selected types and directions
		//j is the current vehicle in the iteration
		for j := 0; j < group[i].groupSize; j++ {

			vehType := "Car"
			if random.Float32() > carPerc {
				vehType = "Truck"
			}
			vehDir := "Southbound"
			if random.Float32() > sPerc {
				vehDir = "Northbound"
			}
			vehID := vehIDcounter
			vehIDcounter++
			wg.Add(1)
			go OneVehicle(vehID, vehType, vehDir)
		}
		time.Sleep(time.Duration(group[i].delay) * time.Second)
	}
	wg.Wait()
}
