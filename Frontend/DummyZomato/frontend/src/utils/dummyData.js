/**
 * Generates dummy hourly activity data for a Zomato delivery partner.
 * Coverage: 6:00 AM to 12:00 AM (Midnight)
 */
export const generateHourlyData = () => {
    const data = [];
    
    for (let hour = 6; hour <= 23; hour++) {
        // Randomized online status (more likely to be online during peak hours)
        let isOnline = false;
        if (hour >= 11 && hour <= 15) isOnline = Math.random() > 0.1; // Lunch peak
        else if (hour >= 19 && hour <= 22) isOnline = Math.random() > 0.1; // Dinner peak
        else isOnline = Math.random() > 0.3; // Others
        
        // Randomized orders (more during peaks)
        let orders = 0;
        if (isOnline) {
            if ((hour >= 12 && hour <= 14) || (hour >= 20 && hour <= 22)) {
                orders = Math.floor(Math.random() * 4) + 2; // 2-5 orders
            } else {
                orders = Math.floor(Math.random() * 3); // 0-2 orders
            }
        }
        
        const timeString = `${hour % 12 || 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
        const nextTimeString = `${(hour + 1) % 12 || 12}:00 ${(hour + 1) >= 12 ? 'PM' : 'AM'}`;

        data.push({
            timeSlot: `${timeString} - ${nextTimeString}`,
            hour: hour,
            isOnline: isOnline,
            ordersAccepted: orders,
            earnings: orders * 45 // Approx ₹45 per order
        });
    }
    
    return data;
};

// Example usage and verification
// console.log(JSON.stringify(generateHourlyData(), null, 2));
