// Q1: SImple



// You have to print the numbers from 1 to 200 in new line.

// But for every multiple of 5 print "Do", for every multiple of 7 print "Die" and for every multiple of both 5 and 7 print "DoOrDie" instead of the number.



/**

Sample Output :

1

2

3

4

Do

6

Die

8

9

Do

.

.

.

34

DoOrDie

36

37

.

.

.

199

Do

*/



for(let i=1;i<=200;i++){
    if(i%5===0  && i%7!=0){
        console.log("Do")
    }else if(i%7===0  && i%5!=0){
        console.log("Die")
    }else if(i%5===0 && i%7===0){
        console.log("DoOrDie")
    }else{
        console.log(i)
    }
}