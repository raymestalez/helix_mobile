import moment from 'moment'

export function generateCurrentWeek() {
    /* Generate empty calendar for the current week */
    var names = [ 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun' ];
    var currentDate = moment();
    var weekStart = currentDate.clone().startOf('isoweek');
    var days = [];
    for (var i = 0; i <= 6; i++) {
	days.push({
	    date: moment(weekStart).add(i, 'days').format("YYYY-MM-DD"),
	    value: null,
	    name: names[i]
	})
    }
    return days
}

export function loadCheckmarks(savedCheckmarks) {
    /* Generate empty calendar for the current week */
    var days = generateCurrentWeek()
    const timeline = days.map((day, i)=>{
	/* Loop through saved checkmarks,
	   if I find a saved value for today,
	   I load it into the calendar */
	savedCheckmarks.map((c)=>{
	    if (c.date === day.date) {
		day.value = c.value
	    } 
	})
	return day
    })
    return timeline
}


export function updateCheckmark(checkmark, habits) {
    /* Loop through all habits */
    habits.map((habit)=>{
	var savedCheckmarkFound = false
	/* Find the habit this checkmark belongs to */
	if (habit.title == checkmark.habit) {
	    /* Loop through all it's' checkmarks */
	    habit.checkmarks.map((c)=>{
		/* Find the checkmark I want to update (at this date) */
		if (c.date == checkmark.date) {
		    /* Set value */
		    /* Loop through checkmark states:
		       null is empty
		       1 is check
		       2 is thumbsup
		       0 is fail */
		    if (c.value == 0) {
			c.value = null
		    } else if (c.value == 2) {
			c.value = 0
		    } else {
			c.value = checkmark.value + 1
		    }
		    savedCheckmarkFound = true
		    console.log(`Update ${checkmark.habit} to ` + c.value)
		}
	    })
	    if (!savedCheckmarkFound) {
		/* If I haven't found saved checkmark to update, Im saving a new one. */
		habit.checkmarks.push({
		    date: checkmark.date,
		    value: 1
		})
		console.log("Added checkmark " + checkmark.date)
	    }
	}
    })

    return habits
}

export function calculateStreak(checkmarks) {
    /* console.log("Calculating streak " + JSON.stringify(checkmarks))*/
    var currentStreak = 0
    /* Order days starting with the most recent one  */
    checkmarks.reverse()

    var today = moment()
    var thisDate = today.format('YYYY-MM-DD')

    /* Loop through dates backwards, starting from today,
       if checkmark is there and is checked, I increment the streak. */
    for (var i = 0; i < checkmarks.length; i++) {
	var checked = false
	checkmarks.map((checkmark)=>{
	    /* Find today's checkmark */
	    if (checkmark.date == thisDate) {
		if (checkmark.value == 1 || checkmark.value == 2) {
		    /* Increment the streak if this habit is completed */
		    currentStreak += 1
		    checked = true
		}
	    }
	})
	/* If the checkmark for this day isn't checked, streak is over */
	if (!checked) {break}

	/* The previous day  */
	thisDate = moment(thisDate).subtract(1,'days').format('YYYY-MM-DD')
    }

    /* console.log("Return Current streak " + currentStreak);*/
    return currentStreak;
}

