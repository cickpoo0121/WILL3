//<=========== Import packages ==========>
const express = require("express");
const path = require("path");
const body_parser = require("body-parser");
const multer = require("multer");
const mysql = require("mysql");
const config = require("./dbConfig.js");
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
app.post("/uploading/:email", function (req, res) {
    const email = req.params.email
    upload(req, res, function (err) {
        if (err) {
            // An unknown error occurred when uploading.
            res.status(500).send("ไม่สามารถอัพโหลดไฟล์นี้ได้");
            return;
        }
        // Everything went fine.
        console.log(email)
        importExelData2MySQL(res, __dirname + '/upload/Exel/' + req.file.filename, email)
        console.log(req.file.filename)
        // res.status(200).send("บันทึกสำเร็จ");
    })
});


// Add image to an item
app.put("/item/addImage", function (req, res) {
    const image = req.body.image;
    const Inventory_Number = req.body.Inventory_Number;
    const sql = "UPDATE item SET Image=? where Inventory_Number=?;"
    con.query(sql, [image, Inventory_Number], function (err, result, fields) {
        if (err) {
            res.status(503).send("เซิร์ฟเวอร์ไม่ตอบสนอง");
        }
        else {
            res.send("แก้ไขข้อมูลเรียบร้อย");
        }
    })
});

// // Load info of commitee
app.get("/adminhistorytableEmailCommittee/info/:year", function (req, res) {
    const Year = req.params.year;
    const sql = "SELECT DISTINCT Email_Committee FROM item WHERE Year = ? AND Email_Committee IS NOT NULL "
    con.query(sql, [Year], function (err, result, fields) {
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
    res.sendFile(path.join(__dirname, "/views/home.html"));
    // res.render("home.ejs", {user: req.user});
});

//Return manageUser page
app.get("/checkpage", function (req, res) {
    res.sendFile(path.join(__dirname, "/checkpage.html"))
});

//Return findCar page
app.get("/findCar", function (req, res) {
    res.sendFile(path.join(__dirname, "/views/findCar.html"))
});

//Return carrent page
app.get("/carrent", function (req, res) {
    res.sendFile(path.join(__dirname, "/views/carrent.html"))
});


// ========== Starting server ============
const PORT = 35000
app.listen(PORT, function () {
    console.log("Server is running at " + PORT);
});