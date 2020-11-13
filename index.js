//<=========== Import packages ==========>
const express = require("express");
const path = require("path");
const body_parser = require("body-parser");
const multer = require("multer");
const mysql = require("mysql");
const config = require("./config/dbConfig");
// const authRoutes = require("./routes/auth-routes");
// const profileRoutes = require("./routes/profile-routes");
// const passportSetup = require("./config/passport-setup");
// const passport = require("passport");
// const cookieSession = require("cookie-session");
// const key = require("./config/key");
// const xlsx = require("xlsx");

// const readXlsxfile = require("read-excel-file/node")
// var pdfMake = require('pdfmake/build/pdfmake.js');
// var pdfFonts = require('pdfmake/build/vfs_fonts.js');
// pdfMake.vfs = pdfFonts.pdfMake.vfs;
const bcrypt = require('bcrypt');
const saltRounds = 10;
// const moment = require('moment');
const app = express();
const con = mysql.createConnection(config);
// app.use('/Image', express.static('./upload/Image'));


//=========Put to use==========
const storageOption = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/Exel/')
    },
    filename: function (req, file, cb) {

        cb(null, d + "_" + file.originalname);

    }
});


const upload = multer({ storage: storageOption }).single("filetoupload");


//<=========== Middleware ==========>
app.use(body_parser.urlencoded({ extended: true })); //when you post service
app.use(body_parser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/assets/images", express.static(path.join(__dirname, '/assets/images')));
// app.use("/style.css", express.static(path.join(__dirname, 'style.css')));
// app.use("/upload", express.static(path.join(__dirname, 'upload')));

//cookie
// app.use(cookieSession({
//     // maxAge: 1000*60*60,
//     maxAge: 1000 * 60 * 60,
//     keys: [key.cookie.secret]
// }));
// init passport for se/derialization
// app.use(passport.initialize());
// // session
// app.use(passport.session());
// // authen
// app.use("/auth", authRoutes);
// // profle
// app.use("/profile", profileRoutes);




//================== Services (functions) ===================

// ============= Upload ==============
// app.post("/uploading/:email", function (req, res) {
//     const email = req.params.email
//     upload(req, res, function (err) {
//         if (err) {
//             // An unknown error occurred when uploading.
//             res.status(500).send("ไม่สามารถอัพโหลดไฟล์นี้ได้");
//             return;
//         }
//         // Everything went fine.
//         console.log(email)
//         importExelData2MySQL(res, __dirname + '/upload/Exel/' + req.file.filename, email)
//         console.log(req.file.filename)
//         // res.status(200).send("บันทึกสำเร็จ");
//     })
// });

app.post("/booking", function (req, res) {
    const { Name, Phone, Among } = req.body
    const sql = "INSERT INTO `booking` ( `Name`, `Phone`, `Among`) VALUES ( ?, ?, ?);"
    con.query(sql, [Name, Phone, Among], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง")
            console.log(err)
        }
        else {
            res.send("สำเร็จ");
        }
    })
});


// Add image to an item
// app.put("/item/addImage", function (req, res) {
//     const image = req.body.image;
//     const Inventory_Number = req.body.Inventory_Number;
//     const sql = "UPDATE item SET Image=? where Inventory_Number=?;"
//     con.query(sql, [image, Inventory_Number], function (err, result, fields) {
//         if (err) {
//             res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
//         }
//         else {
//             res.send("แก้ไขข้อมูลเรียบร้อย");
//         }
//     })
// });

// // Load lat lng of trip place
app.get("/latlng/:Tripid", function (req, res) {
    const Tripid = req.params.Tripid;
    const sql = "SELECT * FROM latlong latlng,tripinfor trip WHERE latlng.TripID=trip.TripID and latlng.TripID=?"
    con.query(sql, [Tripid], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// // Load lat lng of trip place
app.get("/customer", function (req, res) {
    const sql = "SELECT * FROM `booking`"
    con.query(sql, function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// // Load lat lng of trip place
app.get("/tripName", function (req, res) {
    const Tripid = req.params.Tripid;
    const sql = "SELECT * FROM `tripinfor`"
    con.query(sql, function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// get user
app.get("/checkusername", function (req, res) {
    const Userid = req.params.Userid;
    const sql = "SELECT * FROM `user`"
    con.query(sql, function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        } else {
            res.json(result)
        }
    })
});

// =========== Services (Page loading) ===========

//Root Page (landing page 1)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/selectTrip.html"));
    // res.render("home.ejs", {user: req.user});
});

//Return login page
app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname, "/views/login.html"))
});

//Return register page
// app.get("/register", function (req, res) {
//     res.sendFile(path.join(__dirname, "/views/register.html"))
// });


//Return Admin page
app.get("/admin", function (req, res) {
    res.sendFile(path.join(__dirname, "/views/adminTrip.html"));
});

//Return Shop page
// app.get("/carshop", function (req, res) {
//     res.sendFile(path.join(__dirname, "/views/carshop.html"));
// });

//Return findCar page
// app.get("/findCar", function (req, res) {
//     res.sendFile(path.join(__dirname, "/views/findCar.html"))
// });

//Return carrent page
// app.get("/carrent", function (req, res) {
//     res.sendFile(path.join(__dirname, "/views/carrent.html"))
// });


//Return map page
// app.get("/map", function (req, res) {
//     res.sendFile(path.join(__dirname, "/views/map.html"))
// });

//Return test page
app.get("/test", function (req, res) {
    res.sendFile(path.join(__dirname, "/views/test.html"))
});


//Return travel page
// app.get("/travelplan", function (req, res) {
//     res.sendFile(path.join(__dirname, "/views/travelplan.html"))
// });

//Return payment page
// app.get("/payment", function (req, res) {
//     res.sendFile(path.join(__dirname, "/views/payment.html"))
// });

//Return booking page
// app.get("/booking", function (req, res) {
//     res.sendFile(path.join(__dirname, "/views/booking.html"))
// });

//Return booking page
// app.get("/selectTrip", function (req, res) {
//     res.sendFile(path.join(__dirname, "/views/selectTrip.html"))
// });

//Return tripinfor page
app.get("/tripinformation", function (req, res) {
    res.sendFile(path.join(__dirname, "/views/tripInfor.html"))
});


// ========== Starting server ============

const PORT = process.env.PORT || 35000
app.listen(PORT, function () {
    console.log("Server is running at " + PORT);
});