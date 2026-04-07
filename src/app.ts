function haversine(latitudeA:number, longitudeA:number, latitudeB:number, longitudeB:number): number { 
    //Convert degrees to radians
    const toRadians = (degrees: number) => degrees * Math.PI / 180; //arrow function
    
    const latA = toRadians(latitudeA);
    const lonA = toRadians(longitudeA);
    const latB = toRadians(latitudeB);
    const lonB = toRadians(longitudeB);

    //Difference between the two points
    const dLat = latB - latA;
    const dLon = lonB - lonA;

    //Haversine formula (it accounts for the curvature of the Earth)
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(latA) * Math.cos(latB) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = 6371 * c; // Earth's radius in kilometers

    return distance;
}