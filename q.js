// function abc(arr){

//     for(let i=0;i<arr.length;i++){
//         let dob=new Date(arr[i].other[0].birthday);
//        // console.log(dob)
//         let day=new Date("2022/8/20")

//         var month_diff = day.getTime() - dob.getTime(); 
//         //console.log(month_diff) 
              
//         //convert the calculated difference in date format  
//         var age_dt = new Date(month_diff);   
//         //console.log(age_dt)
//         //extract year from date      
//         var year = age_dt.getUTCFullYear();  
//                // console.log(year)
        
//         //now calculate the age of the user  
//         var age = Math.abs(year - 1970);  
//                // console.log(age)
        
//         if(age>=18 && age!=58 && age<58){
//             console.log(age)
//         } 
//     }

// }


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

// console.log(abc(people_array));









// function abc(arr){

//     let arr1=[]
   
//        for(let i=0;i<arr.length;i++){
//            let dob=new Date(arr[i].other[0].birthday);
//           // console.log(dob)
//            let day=new Date("2022/8/20")
   
//            var month_diff = day.getTime() - dob.getTime(); 
//            //console.log(month_diff) 
                 
//            //convert the calculated difference in date format  
//            var age_dt = new Date(month_diff);   
//            //console.log(age_dt)
//            //extract year from date      
//            var year = age_dt.getUTCFullYear();  
//                   // console.log(year)
           
//            //now calculate the age of the user  
//            var age = Math.abs(year - 1970);  
//                   // console.log(age)
           
//            if(age>=18 && age!=58 && age<58){
//                arr1.push(age)
//            } 
//        }
//        return arr1;
   
//    }
   
   
//    const people_array = [
   
//      {
   
//        name: 'sahil',
   
//        other: [
   
//          {
   
//            birthday: '10 August 2002',
   
//          },
   
//        ],
   
//      },
   
//      {
   
//        name: 'sneha',
   
//        other: [
   
//          {
   
//            birthday: '1 January 2006',
   
//          },
   
//        ],
   
//      },
   
//      {
   
//        name: 'minal',
   
//        other: [
   
//          {
   
//            birthday: '1 February 2005',
   
//          },
   
//        ],
   
//      },
   
//      {
   
//        name: 'snehal',
   
//        other: [
   
//          {
   
//            birthday: '3 March 1960',
   
//          },
   
//        ],
   
//      },
   
//      {
   
//        name: 'raj',
   
//        other: [
   
//          {
   
//            birthday: '1 January 2005',
   
//          },
   
//        ],
   
//      },
   
//    ];
   
//    console.log(abc(people_array));










   // function abc(arr){

//     for(let i=0;i<arr.length;i++){
//         let dob=arr[i].other[0].birthday;
//         let day=new Date("2022/8/20")

//         var month_diff = day.getTime() - dob.getTime(); 
//         //console.log(month_diff) 
      
//         //convert the calculated difference in date format  
//         var age_dt = new Date(month_diff);   
//         //console.log(age_dt)
//         //extract year from date      
//         var year = age_dt.getUTCFullYear();  
//        // console.log(year)

//         //now calculate the age of the user  
//         var age = Math.abs(year - 1970);  
//        // console.log(age)

//         if(age>=18 && age!=58 && age<58){
//             console.log(age)
//         }
//     }

// }


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

// console.log(abc(people_array));
