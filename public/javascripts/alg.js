 const FOCUS_MULTIPLIER = 2.5;
 const FATIGUE_RUST = 0.012;
 const FATIGUE_MULT = 0.08;
 let default_weights = [0, 1, 1, 1, 1, 1, 1, 1, 0.5, 1.3, 0.2]
 let equip_delay = [0, 10, 30, 40, 10, 10,
 10, 10, 20, 10,  0,
 0, 60,  0, 40, 10,
 0, 40, 90, 10, 20]

 var exercises = [];
 var num_types_equipment = 19,
 num_body_parts = 11;
 var equipment_is_machine = false;
 var p = {
    "intensity": 500,
    "focus": [],
    "available_equipment": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
    "min_pref": 60
};

function generate_workout() {
    var intended_fatigue = [];
    let _it_ftg = 9 * p.intensity;
    let _ut_ftg = default_weights.map(x=>((p.focus.indexOf(x)>0)?1:FOCUS_MULTIPLIER)*x).reduce((a,b)=>a+b,0);

    let _g_ftg_m = _it_ftg / _ut_ftg;
    for (let i = 0; i < num_body_parts; i++) {
        intended_fatigue.push(_g_ftg_m * default_weights[i]);
    }
    for (let i = 0; i < p.focus.length; i++) {
        intended_fatigue[p.focus[i]] = default_weights[p.focus[i]] * FOCUS_MULTIPLIER * _g_ftg_m;
    }
    var seconds_left = p.min_pref * 60;
    var next_seconds_left;
    var current_fatigue = Array(num_body_parts).fill(0.);
    var next_fatigue = [];
    var fatigue_diff = current_fatigue.slice(0);
    var another_exercise = true;
    var ret = [];
    while (another_exercise) {
        var best_choice, cur_choice;
        var best_choice_dev = 10000000.0;
        var cur_choice_dev;
        var best_choice_ind;
        for (let i = 0; i < num_body_parts; i++)
        {
          fatigue_diff[i] = current_fatigue[i] - intended_fatigue[i];
      }
      var seconds_rest = Math.floor(Math.max(Math.max( ...fatigue_diff ),0)/FATIGUE_RUST);
      for (let i = 0; i < Object.keys(exercises).length; i++) {
          var equipment_is_avail = true;
          next_seconds_left = seconds_left - seconds_rest;
          for (let j = 0; j < exercises[i].equipment.length; j++)
          {
              if (p.available_equipment.indexOf(exercises[i].equipment[j]) <= 0)
              {
                 equipment_is_avail = false;
                 break;
             }
             next_seconds_left -= equip_delay[j];
         }	
         if (equipment_is_avail === false)
         {
          continue;
      }
      next_fatigue = current_fatigue.slice(0);
      cur_choice = {
        "exercise_id": i,
        "sets": 1,
        "reps": 0
    };
    var more_reps = true;
    for (let j = 0; more_reps; j++) {
        cur_choice.reps++;
        next_seconds_left -= (exercises[i].sec_per_rep || 5);
        for (let k = 1; k < num_body_parts; k++) {
            next_fatigue[k] -= FATIGUE_RUST * (exercises[i].sec_per_rep || 5);
        }
        for (let k = 0; k < exercises[i].body_parts.length; k++) {
         next_fatigue[exercises[i].body_parts[k]] += FATIGUE_MULT * (exercises[i].level+1);
         if (next_fatigue[exercises[i].body_parts[k]] > intended_fatigue[exercises[i].body_parts[k]]) {
            more_reps = false;
            break;
        }
    }
}         
let reps_per_rep = [0, 4, 4, 4, 4, 8, 8, 8, 8, 10, 10,
10, 12, 12, 15, 15, 15, 8, 8, 10, 10,
10, 10, 12, 12, 12, 12, 15, 15, 15, 15
];
let sets_per_rep = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
1, 1, 1, 1, 1, 1, 2, 2, 2, 2,
2, 2, 2, 2, 2, 2, 2, 2, 2, 2
];
if (cur_choice.reps > 30) {
    cur_choice = {
        "exercise_id": i,
        "sets": 2,
        "reps": 15
    };
} else {
    cur_choice = {
        "exercise_id": i,
        "sets": sets_per_rep[cur_choice.reps],
        "reps": reps_per_rep[cur_choice.reps]
    };
}
next_seconds_left = seconds_left - seconds_rest;
next_fatigue = current_fatigue.slice(0);
for (let k = 0; k < num_body_parts; k++) {
    next_fatigue[k] -= FATIGUE_RUST * ((exercises[i].sec_per_rep || 5) * cur_choice.reps * cur_choice.sets + (cur_choice.sets-1) * 5);
}
for (let k = 0; k < exercises[i].body_parts.length; k++) {
    next_fatigue[exercises[i].body_parts[k]] += FATIGUE_MULT * exercises[i].level * cur_choice.reps *
    cur_choice.sets;
}
next_seconds_left -= cur_choice.reps * cur_choice.sets * (exercises[i].sec_per_rep || 5) - (cur_choice.sets-1)*5;
cur_choice_dev = 0;
for (let k = 1; k < num_body_parts; k++) {
    cur_choice_dev += Math.pow(next_fatigue[k] - intended_fatigue[k], 2.0);
}
if (cur_choice_dev < best_choice_dev) {
    best_choice_dev = JSON.parse(JSON.stringify(cur_choice_dev));
    best_choice = JSON.parse(JSON.stringify(cur_choice));
    best_choice_ind = i;
}
}
if (seconds_rest > 0)
{
  ret.push({
    "exercise_id": 0,
    "sets": 0,
    "reps": seconds_rest});
}
ret.push(JSON.parse(JSON.stringify(best_choice)));
next_seconds_left = seconds_left - seconds_rest;
next_fatigue = current_fatigue.slice(0);
var i = best_choice_ind;
for (let k = 0; k < num_body_parts; k++) {
    next_fatigue[k] -= FATIGUE_RUST * (exercises[i].sec_per_rep || 5) * cur_choice.reps * cur_choice.sets;
}
for (let k = 0; k < exercises[i].body_parts.length; k++) {
    next_fatigue[exercises[i].body_parts[k]] += FATIGUE_MULT * exercises[i].level * cur_choice.reps *
    cur_choice.sets;
}
next_seconds_left -= cur_choice.reps * cur_choice.sets * (exercises[i].sec_per_rep || 5);
seconds_left = next_seconds_left;
if (seconds_left <= 0) {
    another_exercise = false;
}
current_fatigue = next_fatigue.slice(0);
}
console.log (ret);
return ret;
}
function get_data() {
    var config = {
        apiKey: "AIzaSyBLaxKzlm4ns10k-q3MRxgP9mPu-L5sfvE",
        authDomain: "exercise-builder.firebaseapp.com",
        databaseURL: "https://exercise-builder.firebaseio.com",
        projectId: "exercise-builder",
        storageBucket: "exercise-builder.appspot.com",
        messagingSenderId: "678132867363"
    };
    firebase.initializeApp(config);
    database = firebase.database();
    return database.ref().once("value").then(snapshot => snapshot.val());
}
function get_input() {
    console.log("Not implemented!")
}
get_data().then(data => {
    exercises = data["exercises"];
    get_input();
    generate_workout();
});