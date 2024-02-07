
-- Getting All the devices and their types 

SELECT 
u_id, Assigned.device_id,
DEVICE.type,
date_received, date_returned
FROM 
USER 
JOIN Assigned ON USER.u_id=Assigned.user_id
JOIN DEVICE ON DEVICE.d_id=Assigned.device_id


-- Get all the trackers 

SELECT 
u_id, Assigned.device_id,
date_received, date_returned
FROM 
USER 
JOIN Assigned ON USER.u_id=Assigned.user_id
JOIN DEVICE on DEVICE.d_id=Assigned.device_id
WHERE 
type="tracker"




-- Getting all the Tracked events of a tracker that is assigned on a user 

SELECT 
u_id, Assigned.device_id,date_received, date_returned
FROM 
USER 
JOIN Assigned ON USER.u_id=Assigned.user_id
JOIN Tracked ON Assigned.device_id=Tracked.device_id
WHERE
date_tracking=date_received
AND
USER.u_id=?

-- Add the date_tracking to Tracked 
-- Remove the User ID on the Tracked 
-- Add the type of the device to check that it is tracker 

-- ----------------------------
