// Q2



// Create a function to filter an array of people who have an age greater than or equal to 18 years compared to the date (20-August-2022 & Time = 12 PM GMT+5:30). except for those over and equal the age of 58

// Without using any library





// const people_array = [

//   {

//     name: 'sahil',

//     other: [

//       {

//         birthday: '10 August 2002',

//       },

//     ],

//   },

//   {

//     name: 'sneha',

//     other: [

//       {

//         birthday: '1 January 2006',

//       },

//     ],

//   },

//   {

//     name: 'minal',

//     other: [

//       {

//         birthday: '1 February 2005',

//       },

//     ],

//   },

//   {

//     name: 'snehal',

//     other: [

//       {

//         birthday: '3 March 1960',

//       },

//     ],

//   },

//   {

//     name: 'raj',

//     other: [

//       {

//         birthday: '1 January 2005',

//       },

//     ],

//   },

// ];



function abc(arr){

    let arr1=[]
   
       for(let i=0;i<arr.length;i++){
           let dob=Date.parse(arr[i].other[0].birthday);
          // console.log(dob)
           let day=Date.parse("2022/8/20")
   
           var ageinmilliseconds = day - dob; 
           
           
           var milliseconds=ageinmilliseconds;
           var second=1000;
           var minute=second*60;
           var hour=minute*60;
           var dayy=hour*24;
           var month=dayy*30;
           var year=dayy*365;
           
           
           var age=Math.floor(milliseconds/year);    //if we use Math.round() then final output will be [20,18,18]
                 
          
           
           
           if(age>=18 && age!=58 && age<58){
               arr1.push(age)
           } 
       }
       return arr1;
   
   }
   
   
   const people_array = [
   
     {
   
       name: 'sahil',
   
       other: [
   
         {
   
           birthday: '10 August 2002',
   
         },
   
       ],
   
     },
   
     {
   
       name: 'sneha',
   
       other: [
   
         {
   
           birthday: '1 January 2006',
   
         },
   
       ],
   
     },
   
     {
   
       name: 'minal',
   
       other: [
   
         {
   
           birthday: '1 February 2005',
   
         },
   
       ],
   
     },
   
     {
   
       name: 'snehal',
   
       other: [
   
         {
   
           birthday: '3 March 1960',
   
         },
   
       ],
   
     },
   
     {
   
       name: 'raj',
   
       other: [
   
         {
   
           birthday: '1 January 2005',
   
         },
   
       ],
   
     },
   
   ];
   
   console.log(abc(people_array));








































