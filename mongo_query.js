db.points10m.find({
    "geometry.coordinates": { $geoWithin: { $box:
        [[85.71533203125, 57.89149735271031 ],
            [ 87.35620117187499, 61.05296842431332]]}}
}).count()
// 6247
