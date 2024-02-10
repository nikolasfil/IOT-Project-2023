
--- Selecting all the active trackers that have not been assigned to a user at this particular day 


SELECT DISTINCT d_id
FROM DEVICE
WHERE d_id NOT IN
(SELECT device_id FROM Assigned
where date_received<=DATE("now") and (date_returned > DATE("now") or date_returned=Null))
and status = 'active' and type='Asset tracking'


















-- ============================

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
u_id, Assigned.device_id,
date_received, date_returned
FROM 
USER 
JOIN Assigned ON USER.u_id=Assigned.user_id
JOIN DEVICE on DEVICE.d_id=Assigned.device_id
JOIN Tracked on Assigned.device_id=Tracked.device_id
WHERE
date_tracking=date_received
AND
USER.u_id=?


-- Getting all the Buttons of a tracker that is assigned to a user  


SELECT 
u_id, Assigned.device_id,
date_received, date_returned
FROM 
USER 
JOIN Assigned ON USER.u_id=Assigned.user_id
JOIN DEVICE on DEVICE.d_id=Assigned.device_id
JOIN Pressed on Assigned.device_id=Pressed.device_id
WHERE
date_pressed=date_received
AND
USER.u_id=?


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


-- Get all the dates the user had a Tracker assigned 

-- Just the dates 
SELECT
date_received
-- , user_id -- with the user_id 
FROM 
Assigned 
group by user_id

--- ----------------------------

-- Get all the dates the user had a Tracker assigned

Select A.device_id, A.user_id, D.type
,P.date, P.time
-- , A.date_received, A.date_returned
,P.longitude,P.latitude

from Assigned as A 
join DEVICE as D on D.d_id=A.device_id
join Tracked as P on P.device_id=A.device_id
where P.date >= A.date_received and (P.date< A.date_returned or A.date_returned=NULL)


---------------------------


--- Get all the Pressed events of a tracker that is assigned to a user

Select A.device_id, A.user_id, D.type
,P.date, P.time
,P.event
from Assigned as A 
join DEVICE as D on D.d_id=A.device_id
join Pressed as P on P.device_id=A.device_id
where P.date >= A.date_received and (P.date< A.date_returned or A.date_returned=NULL)



---- ----------------------------

-- All the Asset tracking devices that are have not been given to a user or are not returned 
-- All the asset tracking devices that are available

SELECT DISTINCT d_id
FROM DEVICE
WHERE d_id NOT IN 
(SELECT device_id FROM Assigned 
where date_received<=DATE("now") and (date_returned > DATE("now") or date_returned=Null))
and status = 'active' and type='Asset tracking'