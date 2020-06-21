"use strict";

function openCity(evt, cityName) {
  var x, tablinks;
  x = document.getElementsByClassName("city");

  for (let i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablink");

  for (let i = 0; i < x.length; i++) {
    tablinks[i].className = tablinks[i].className.replace("w3-red", "");
  }

  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " w3-red";
}

; ////   

var gMyTableOne = [];
var gMyTableTwo = [];
$('#mytable td').click(function () {
  var $this = $(this);
  $this.toggleClass('newclass', !$this.hasClass('newclass') && $('#mytable .newclass').length < 5);
  var myTableOne = [];
  $('#mytable .newclass').each(function (i, v) {
    myTableOne.push($(v).text());
  });
  $('#selectedRows').val(myTableOne);
  gMyTableOne = myTableOne;
});
$('#mytable2 td').click(function () {
  var $this = $(this);
  $this.toggleClass('newclass2', !$this.hasClass('newclass') && $('#mytable2 .newclass2').length < 1);
  var myTableTwo = [];
  $('#mytable2 .newclass2').each(function (i, v) {
    myTableTwo.push($(v).text());
  });
  $('#selectedRowsTwo').val(myTableTwo);
  gMyTableTwo = myTableTwo;
});
let mainUserDataForResult = [];
let mainId = 1;

function myCreateFunction() {
  const noOfBatch = $("#numberOfBatchs").val();
  const selectType = $("#selectType").val();
  let noOfRows = $("#numberOfRows").val();

  if (noOfBatch === "notSet") {
    return toastr.error("Select Number of Batch");
  }

  if (selectType === "notSet") {
    return toastr.error("Please select type");
  }

  if (noOfRows === "notSet" && selectType === "generated") {
    return toastr.error("Please select number of rows");
  }

  if (selectType == 'self' && (gMyTableOne.length < 5 || gMyTableTwo.length < 1)) return toastr.error("Minium 5 numbers and 1 SE required");

  if (selectType === 'self') {
    noOfRows = 1;
  }

  const data = gMyTableOne.concat(gMyTableTwo);
  let response = localStorage.getItem("response");
  let is_premimum = 0;

  if (response) {
    const localItem = JSON.parse(response);
    is_premimum = localItem.is_premium;
  }

  let postData = {
    noOfRows: parseInt(noOfRows),
    selectType,
    noOfBatch: parseInt(noOfBatch),
    data
  };
  manageUserInput(postData);
}

function manageUserInput(postData) {
  let numberOfDraw = postData.noOfBatch;
  let noOfRows = postData.noOfRows;
  let selectType = postData.selectType;
  let data = postData.data.toString();
  let d = new Date();
  let hours = d.getHours();
  let min = d.getMinutes();
  let q = min % 4;
  let nextDrawNumber = Math.ceil((hours * 60 + min) / 4);

  if (min % 4 === 0) {
    nextDrawNumber++;
  }

  const tempUserData = [...mainUserDataForResult];

  if (isPremium()) {
    mainUserDataForResult = [];
  }

  for (let i = 0; i < numberOfDraw; i++) {
    let numberOfAlreadyRows = getNumberOfRows(tempUserData, nextDrawNumber + i);
    let prevOfDraw = getNumberOfDraw(tempUserData, nextDrawNumber + i);

    if (prevOfDraw + numberOfDraw >= 60) {
      toastr.error("You Can't add more than 60 draw");
      return 0;
    }

    if (!isPremium() && numberOfAlreadyRows + noOfRows > 5) {
      toastr.error("You Can't add more than 5 rows, for add more row please buy plan");
      return 0;
    }

    if (numberOfAlreadyRows + noOfRows >= 100) {
      toastr.error("You Can't more than 100 rows");
      return 0;
    }

    for (let j = 0; j < noOfRows; j++) {
      if (selectType === 'self') {
        let tempData = {
          id: mainId,
          draw_no: nextDrawNumber + i,
          num_gen: data,
          is_completed: 0,
          result: "L",
          points: 0,
          date: getFormattedDate(Date.now())
        };
        mainUserDataForResult.push(tempData);
        mainId++;
      } else {
        let iData = [];
        iData[0] = Math.floor(Math.random() * 100) + 1;
        iData[1] = Math.floor(Math.random() * 100) + 1;
        iData[2] = Math.floor(Math.random() * 100) + 1;
        iData[3] = Math.floor(Math.random() * 100) + 1;
        iData[4] = Math.floor(Math.random() * 100) + 1;
        iData.sort(function (a, b) {
          return a - b;
        });
        iData[5] = Math.floor(Math.random() * 30) + 1;
        iData = iData.toString();
        let tempData = {
          id: mainId,
          draw_no: nextDrawNumber + i,
          num_gen: iData,
          is_completed: 0,
          result: "L",
          points: 0,
          date: getFormattedDate(Date.now())
        };
        mainUserDataForResult.push(tempData);
        mainId++;
      }
    }

    ;
  }

  if (!isPremium()) {
    createNextDrawTable(mainUserDataForResult);
    createUpcomingTable(mainUserDataForResult);
    createCompletedTable(mainUserDataForResult);
    setStatitics(mainUserDataForResult);
  } else {
    saveUserData(mainUserDataForResult);
  }
}

function getNumberOfDraw(Idata) {
  if (Idata.length > 0) {
    Idata.sort((a, b) => {
      if (a.draw_no > b.draw_no) return 1;
      if (b.draw_no > a.draw_no) return -1;
      return 0;
    });
    let drawNo = 0;

    for (let i = 0; i < Idata.length;) {
      let prevDrawNo = Idata[i].draw_no;
      drawNo++;

      while (i < Idata.length && Idata[i].draw_no == prevDrawNo) {
        i++;
      }
    }

    return drawNo;
  }

  return 0;
}

function saveUserData(Idata) {
  mainUserDataForResult = [];
  let response = localStorage.getItem("response");
  response = JSON.parse(response);
  $.ajax({
    type: 'POST',
    contentType: "application/json",
    headers: {
      'Authorization': `Bearer ${response.token}`
    },
    dataType: 'json',
    data: JSON.stringify({
      data: Idata
    }),
    url: 'api/game/saveData',
    success: function (result) {
      mainUserDataForResult = result.data;
      setStatitics(mainUserDataForResult);
      createNextDrawTable(mainUserDataForResult);
      createUpcomingTable(mainUserDataForResult);
      createCompletedTable(mainUserDataForResult);
    },
    error: function (response) {
      let result = response.responseJSON;
      let msg = result.errors;
      toastr.error(msg);

      if (result.code == 403) {
        setToNotPremium();
      }

      if (result.code == 401) {
        logout();
      }
    }
  });
}

function getUserData() {
  let response = localStorage.getItem("response");
  response = JSON.parse(response);
  $.ajax({
    type: 'GET',
    contentType: "application/json",
    headers: {
      'Authorization': `Bearer ${response.token}`
    },
    dataType: 'json',
    url: 'api/game/getUserData',
    success: function (result) {
      mainUserDataForResult = result.data;
      setStatitics(mainUserDataForResult);
      createNextDrawTable(mainUserDataForResult);
      createUpcomingTable(mainUserDataForResult);
      createCompletedTable(mainUserDataForResult);
    },
    error: function (response) {
      let result = response.responseJSON;
      let msg = result.errors;
      toastr.error(msg);

      if (result.code == 403) {
        setToNotPremium();
      }

      if (result.code == 401) {
        logout();
      }
    }
  });
}

function setToNotPremium() {
  let response = localStorage.getItem("response");

  if (response) {
    let localItem = JSON.parse(response);
    localItem.is_premium = 0;
    localStorage.removeItem("response");
    localStorage.setItem("response", JSON.stringify(localItem));
    manageHeader();
  }
}

function isPremium() {
  let is_premimum = 0;
  let response = localStorage.getItem("response");

  if (response) {
    const localItem = JSON.parse(response);
    is_premimum = localItem.is_premium;
  }

  return is_premimum == 1 ? true : false;
}

function createUpcomingTable(IData) {
  let d = new Date();
  let hours = d.getHours();
  let min = d.getMinutes();
  let nextDrawNumber = Math.ceil((hours * 60 + min) / 4);

  if (min % 4 === 0) {
    nextDrawNumber++;
  }

  let upComingDraw = nextDrawNumber + 1;
  let JData = IData.filter(element => {
    return element.draw_no > nextDrawNumber;
  });
  let fData = JData.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });
  let html = '';
  let upcomingData = [];

  for (let i = 0; i < fData.length; i++) {
    let prevDate = new Date(fData[i].date);
    let tempData = [];

    while (i < fData.length && new Date(fData[i] == prevDate)) {
      tempData.push(fData[i]);
      i++;
    }

    upcomingData.push(tempData);
  }

  let finalData = [];

  for (let i = 0; i < upcomingData.length; i++) {
    let sData = upcomingData[0];
    finalData[i] = [];
    sData.sort((a, b) => {
      if (a.draw_no < b.draw_no) return -1;
      return a.draw_no > b.draw_no ? 1 : 0;
    });

    for (let j = 0; j < sData.length;) {
      let prevDate = sData[j].draw_no;
      let tData = [];

      while (j < sData.length && sData[j].draw_no == prevDate) {
        tData.push(sData[j]);
        j++;
      }

      finalData[i].push(tData);
    }
  }

  finalData.forEach(mainData => {
    if (mainData.length == 0) {
      return;
    }

    html = html + `<button class="accordion">
              ${mainData[0][0].date}
            </button>
            <div class="panel">`;
    mainData.forEach(element => {
      html = html + `
      <button class="accordion">Draw : ${element[0].draw_no} 
      </button>
      <div class="panel">
      <table id="myTable4">
      <tbody>
      `;
      element.forEach((ele, index) => {
        let tempGenNum = ele.num_gen.split(",");
        html = html + ` <tr>
        <td>#${index + 1}</td>
        <td>${tempGenNum[0]}</td>
        <td>${tempGenNum[1]}</td>
        <td>${tempGenNum[2]}</td>
        <td>${tempGenNum[3]}</td>
        <td>${tempGenNum[4]}</td>
        <td>${tempGenNum[5]}</td>

      </tr>
          `;
      });
      html = html + `</tbody></table></div>`;
    });
    html = html + '</div>';
  });
  $("#upcoming").html(html);
  var acc = document.getElementsByClassName("accordion");

  for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;

      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  }
}

function createCompletedTable(IData) {
  let d = new Date();
  let hours = d.getHours();
  let min = d.getMinutes();
  let nextDrawNumber = Math.ceil((hours * 60 + min) / 4);

  if (min % 4 === 0) {
    nextDrawNumber++;
  }

  let JData = IData.filter(element => {
    return element.draw_no < nextDrawNumber;
  });
  let fData = JData.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });
  let html = '';
  let upcomingData = [];

  for (let i = 0; i < fData.length; i++) {
    let prevDate = new Date(fData[i].date);
    let tempData = [];

    while (i < fData.length && new Date(fData[i] == prevDate)) {
      tempData.push(fData[i]);
      i++;
    }

    upcomingData.push(tempData);
  }

  let finalData = [];

  for (let i = 0; i < upcomingData.length; i++) {
    let sData = upcomingData[0];
    finalData[i] = [];
    sData.sort((a, b) => {
      if (a.draw_no < b.draw_no) return -1;
      return a.draw_no > b.draw_no ? 1 : 0;
    });

    for (let j = 0; j < sData.length;) {
      let prevDate = sData[j].draw_no;
      let tData = [];

      while (j < sData.length && sData[j].draw_no == prevDate) {
        tData.push(sData[j]);
        j++;
      }

      finalData[i].push(tData);
    }
  }

  finalData.forEach(mainData => {
    if (mainData.length == 0) {
      return;
    }

    html = html + `<button class="accordion1">
              ${mainData[0][0].date}
            </button>
            <div class="panel1">`;
    mainData.forEach(element => {
      html = html + `
      <button class="accordion1">Draw : ${element[0].draw_no} 
      </button>
      <div class="panel1">
      <table id="myTable4">
      <tbody>
      `;
      element.forEach((ele, index) => {
        let tempGenNum = ele.num_gen.split(",");
        html = html + ` <tr>
        <td>#${index + 1}</td>
        <td class="${tempGenNum[0].includes("S") ? "selected-num" : ""}">${tempGenNum[0]}</td>
        <td class="${tempGenNum[1].includes("S") ? "selected-num" : ""}">${tempGenNum[1]}</td>
        <td class="${tempGenNum[2].includes("S") ? "selected-num" : ""}">${tempGenNum[2]}</td>
        <td class="${tempGenNum[3].includes("S") ? "selected-num" : ""}">${tempGenNum[3]}</td>
        <td class="${tempGenNum[4].includes("S") ? "selected-num" : ""}">${tempGenNum[4]}</td>
        <td class="${tempGenNum[5].includes("S") ? "selected-num" : ""}">${tempGenNum[5]}</td>
        <td>${ele.result}</td>
        <td >${ele.points}</td>

      </tr>
          `;
      });
      html = html + `</tbody></table></div>`;
    });
    html = html + '</div>';
  });
  $("#completed").html(html);
  var acc = document.getElementsByClassName("accordion1");

  for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;

      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  }
}

function createNextDrawTable(Idata) {
  let index = 1;
  let d = new Date();
  let hours = d.getHours();
  let min = d.getMinutes();
  let nextDrawNumber = Math.ceil((hours * 60 + min) / 4);

  if (min % 4 === 0) {
    nextDrawNumber++;
  }

  let html = `<h6 class="next-draw-h">Next Draw No : ${nextDrawNumber}</h6>`;
  html = html + `<table id="myTable3">
            <tbody>`;
  Idata.forEach(element => {
    let tempRow = element.num_gen;
    tempRow = tempRow.split(",");

    if (element.draw_no == nextDrawNumber) {
      html = html + `<tr>
              <td>${index}#</td>
              <td>${tempRow[0]}</td>
              <td>${tempRow[1]}</td>
              <td>${tempRow[2]}</td>
              <td>${tempRow[3]}</td>
              <td>${tempRow[4]}</td>
              <td>${tempRow[5]}</td>
              <td><input type="button" id="delPOIbutton" value="\&#x2718;" onclick="myDeleteFunction(${element.id})"/></td>
             </tr>`;
      index++;
    }
  });
  html = html + "</tbody></table>";
  $(".table-data2").html(html);
}

function showResult(mainData, genNumbers, currentDrawnumber) {
  let html = '';
  let index = 1;
  let dataTobeUpdate = [];
  html = html + `<table id="myTable3">
            <tbody>`;
  mainData.forEach(element => {
    if (element.draw_no == currentDrawnumber) {
      let tempRow = element.num_gen;
      tempRow = tempRow.split(",");
      let match = 0;
      let isLastMatch = false;
      let localDataUpdateToBeUpdate = [];

      for (let i = 0; i < tempRow.length; i++) {
        if (i === tempRow.length - 1) {
          if (genNumbers.includes(tempRow[i])) {
            localDataUpdateToBeUpdate[i] = `${tempRow[i]}S`;
            isLastMatch = true;
          } else {
            localDataUpdateToBeUpdate[i] = tempRow[i];
          }
        } else {
          if (genNumbers.includes(tempRow[i])) {
            localDataUpdateToBeUpdate[i] = `${tempRow[i]}S`;
            match++;
          } else {
            localDataUpdateToBeUpdate[i] = tempRow[i];
          }
        }
      }

      let points = getPoint(match, isLastMatch);
      element.is_completed = 1;
      element.result = points !== 0 ? "W" : "L";
      element.points = points;
      element.num_gen = localDataUpdateToBeUpdate.toString();
      dataTobeUpdate.push(element);
      html = html + `<tr>
              <td>${index}#</td>
              <td class=${genNumbers.includes(tempRow[0]) ? "selected-num" : ""}>${tempRow[0]}</td>
              <td class=${genNumbers.includes(tempRow[1]) ? "selected-num" : ""}>${tempRow[1]}</td>
              <td class=${genNumbers.includes(tempRow[2]) ? "selected-num" : ""}>${tempRow[2]}</td>
              <td class=${genNumbers.includes(tempRow[3]) ? "selected-num" : ""}>${tempRow[3]}</td>
              <td class=${genNumbers.includes(tempRow[4]) ? "selected-num" : ""}>${tempRow[4]}</td>
              <td class=${genNumbers.includes(tempRow[5]) ? "selected-num" : ""}>${tempRow[5]}</td>
              <td >${points !== 0 ? "W" : "L"}</td>
              <td>${points}</td>
              <td><input type="button" id="delPOIbutton" value="\&#x2718;" onclick="myDeleteFunction(${element.id})"/></td>
             </tr>`;
      index++;
    }
  });
  html = html + "</tbody></table>";

  if (isPremium()) {
    let response = localStorage.getItem("response");
    response = JSON.parse(response);
    $.ajax({
      type: 'PUT',
      contentType: "application/json",
      headers: {
        'Authorization': `Bearer ${response.token}`
      },
      dataType: 'json',
      data: JSON.stringify({
        data: dataTobeUpdate
      }),
      url: `api/game/updateData/${currentDrawnumber}`,
      success: function (result) {},
      error: function (response) {
        let result = response.responseJSON;
        let msg = result.errors;
        toastr.error(msg);

        if (result.code == 403) {
          setToNotPremium();
        }

        if (result.code == 401) {
          logout();
        }
      }
    });
  }

  $(".table-data2").html(html);
}

function getPoint(match, isLastMatch) {
  let points = 0;

  if (match === 0 && isLastMatch) {
    return 5;
  }

  if (match === 0 && isLastMatch) {
    return 5;
  }

  if (match === 2 && isLastMatch) {
    return 10;
  }

  if (match === 3 && isLastMatch) {
    return 100;
  }

  if (match === 3 && !isLastMatch) {
    return 10;
  }

  if (match === 4 && isLastMatch) {
    return '50k';
  }

  if (match === 4 && !isLastMatch) {
    return 100;
  }

  if (match === 5 && isLastMatch) {
    return '1M';
  }

  if (match === 4 && !isLastMatch) {
    return "500k";
  }

  return 0;
}

function getNumberOfRows(data, draw_no) {
  let count = 0;
  data.forEach(element => {
    if (element.draw_no === draw_no) {
      count++;
    }
  });
  return count;
}

const getFormattedDate = date => {
  let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, day, month].join('-');
};

function myDeleteFunction(id) {
  if (isPremium()) {
    mainUserDataForResult = [];
    let response = localStorage.getItem("response");
    response = JSON.parse(response);
    $.ajax({
      type: 'DELETE',
      contentType: "application/json",
      headers: {
        'Authorization': `Bearer ${response.token}`
      },
      dataType: 'json',
      url: `api/game/deleteGameData/${id}`,
      success: function (result) {
        mainUserDataForResult = result.data;
        setStatitics(mainUserDataForResult);
        createNextDrawTable(mainUserDataForResult);
      },
      error: function (response) {
        let result = response.responseJSON;
        let msg = result.errors;
        toastr.error(msg);

        if (result.code == 403) {
          setToNotPremium();
        }

        if (result.code == 401) {
          logout();
        }
      }
    });
  } else {
    mainUserDataForResult = mainUserDataForResult.filter(element => {
      return element.id !== id;
    });
    createNextDrawTable(mainUserDataForResult);
  }
}

;
$(document).ready(function () {
  $('.login').on('click', ".loginbtn", function () {
    resetValue();
    $("#loginModal").modal("show");
  });
  $(".signup").on("click", function () {
    resetValue();
    $("#loginModal").modal("hide");
    $("#signupModal").modal("show");
  });
  $(".forgetPasswordButton").on("click", function () {
    resetValue();
    $("#loginModal").modal("hide");
    $("#forgetPasswordModal").modal("show");
  });
});
$(".loginSubmit").click(function () {
  resetValue();
  let email = $(".email").val();
  let password = $(".password").val();
  let isValidEmail = ValidateEmail(email);
  let isValidPassword = ValidatePassword(password);

  if (!isValidEmail || !isValidPassword) {
    if (!isValidEmail) {
      $(".emailError").text("Please input valid email");
    }

    if (!isValidPassword) {
      $(".passwordError").text("Password Length must be 3");
    }

    return;
  }

  const data = {
    email,
    password
  };
  $.ajax({
    type: 'POST',
    contentType: "application/json",
    dataType: 'json',
    data: JSON.stringify(data),
    url: 'api/auth/login',
    success: function (result) {
      const response = {
        name: result.data.fullName,
        email: result.data.email,
        token: result.data.token,
        is_premium: result.data.is_premium
      };
      localStorage.setItem("response", JSON.stringify(response));
      $("#loginModal").modal("hide");
      manageHeader();
      toastr.success('Login Successfully');
      getUserData();
    },
    error: function (response) {
      let result = response.responseJSON;
      let msg = result.errors;
      $(".allerror").text(msg);
    }
  });
});
$(".signupSubmit").click(function () {
  resetValue();
  let email = $(".s-email").val();
  let password = $(".s-password").val();
  let confirmPassword = $(".confirmPassword").val();
  let fullName = $(".s-fullname").val();
  let isValidEmail = ValidateEmail(email);
  let isValidPassword = ValidatePassword(password);
  let isValidFullName = ValidateFullName(fullName);
  let isValidConfirmPassword = ValidateConfirmPassword(password, confirmPassword);

  if (!isValidEmail || !isValidPassword || !isValidConfirmPassword || !isValidFullName) {
    if (!isValidEmail) {
      $(".emailError").text("Please input valid email");
    }

    if (!isValidPassword) {
      $(".passwordError").text("Password Length must be 3");
    }

    if (!isValidFullName) {
      $(".fullnameError").text("Full Name Length must be 3");
    }

    if (!isValidConfirmPassword) {
      $(".confirmPasswordError").text("Password and confirm password must be same");
    }

    return;
  }

  const data = {
    email,
    password,
    fullName
  };
  $.ajax({
    type: 'POST',
    contentType: "application/json",
    dataType: 'json',
    data: JSON.stringify(data),
    url: 'api/auth/signup',
    success: function (result) {
      const response = {
        name: result.data.fullName,
        email: result.data.email,
        token: result.data.token,
        is_premium: result.data.is_premium
      };
      localStorage.setItem("response", JSON.stringify(response));
      manageHeader();
      $("#signupModal").modal("hide");
      toastr.success('SignUp Successfully');
    },
    error: function (response) {
      let result = response.responseJSON;
      let msg = result.errors;
      $(".allerror").text(msg);
    }
  });
});
$(".changePasswordSubmitButton").click(function () {
  resetValue();
  let email = $(".f-email").val();
  let password = $(".f-password").val();
  let confirmPassword = $(".f-confirmPassword").val();
  let isValidEmail = ValidateEmail(email);
  let isValidPassword = ValidatePassword(password);
  let isValidConfirmPassword = ValidateConfirmPassword(password, confirmPassword);

  if (!isValidEmail || !isValidPassword || !isValidConfirmPassword) {
    if (!isValidEmail) {
      $(".emailError").text("Please input valid email");
    }

    if (!isValidPassword) {
      $(".passwordError").text("Password Length must be 3");
    }

    if (!isValidConfirmPassword) {
      $(".confirmPasswordError").text("Password and confirm password must be same");
    }

    return;
  }

  const data = {
    email,
    password
  };
  $.ajax({
    type: 'POST',
    contentType: "application/json",
    dataType: 'json',
    data: JSON.stringify(data),
    url: 'api/auth/forgetPassword',
    success: function (result) {
      const response = {
        name: result.data.fullName,
        email: result.data.email,
        token: result.data.token,
        is_premium: result.data.is_premium
      };
      localStorage.setItem("response", JSON.stringify(response));
      $("#forgetPasswordModal").modal("hide");
      manageHeader();
      toastr.success('Password changed Successfully');
    },
    error: function (response) {
      let result = response.responseJSON;
      let msg = result.errors;
      $(".allerror").text(msg);
    }
  });
});

function ValidateEmail(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }

  return false;
}

function ValidatePassword(password) {
  return password.length > 3 ? true : false;
}

function ValidateFullName(fullName) {
  return fullName.length > 3 ? true : false;
}

function ValidateConfirmPassword(password, confirmPassword) {
  if (password === confirmPassword) {
    return true;
  } else {
    return false;
  }
}

function resetValue() {
  $(".emailError").text("");
  $(".passwordError").text("");
  $(".confirmPasswordError").text("");
  $(".allerror").text("");
  $(".fullnameError").text("");
}

function manageHeader(data) {
  let response = localStorage.getItem("response");

  if (response) {
    const localItem = JSON.parse(response);

    if (localItem.is_premium == 1) {
      let showName = localItem.name.split(" ");
      let html = `<div>
    <button type="button" class="btn btn-success logoutbtn" >Logout</button>
      </div>
    <div class="welcome-msg">
      <p >Welcome, ${capitalizeFirstLetter(showName[0])}</p>
    </div>
  `;
      $('.login').html(html);
    } else {
      let showName = localItem.name.split(" ");
      let html = `<div>
    <button type="button" class="btn btn-warning buyPlan" >Buy Plan</button>
    <button type="button" class="btn btn-success logoutbtn" >Logout</button>
      </div>
    <div class="welcome-msg">
      <p >Welcome, ${capitalizeFirstLetter(showName[0])}</p>
    </div>
  `;
      $('.login').html(html);
    }
  } else {
    let html = `<div>
                  <button type="button" class="btn btn-warning buyPlan" >Buy Plan</button>
                  <button type="button" class="btn btn-success loginbtn" >Login</button>
                </div >
    `;
    $('.login').html(html);
  }
}

function logout() {
  localStorage.removeItem('response');
  manageHeader();
}

$('.login').on('click', '.logoutbtn', function () {
  logout();
  toastr.success('Logout Successfully');
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

manageHeader(); // Credit: Mateusz Rybczonec

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;
const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
}; // const TIME_LIMIT = 120;
// let timePassed = 0;
// let timeLeft = TIME_LIMIT;

let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

function setHtml(timeleft) {
  var dt = new Date();
  var secs = dt.getSeconds() + 60 * dt.getMinutes() + 60 * 60 * dt.getHours();
  document.getElementById("app").innerHTML = `
    <div div class="base-timer" >
      <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="base-timer__circle">
          <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
          <path
            id="base-timer-path-remaining"
            stroke-dasharray="283"
            class="base-timer__path-remaining ${remainingPathColor}"
            d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
          ></path>
        </g>
      </svg>
      <span id="base-timer-label" class="base-timer__label">${formatTime(timeleft)}</span>
</div >
    `;
}

function onTimesUp(nextDrawNumber) {
  clearInterval(timerInterval);
  initTimer();
  getNewResultData(nextDrawNumber);
}

function getNewResultData(nextDrawNumber) {
  $.ajax({
    type: 'GET',
    contentType: "application/json",
    dataType: 'json',
    url: `api/game/getNextDraw/${nextDrawNumber} `,
    success: function (result) {
      manageResult(mainUserDataForResult, result.data, nextDrawNumber);
    },
    error: function (response) {
      let result = response.responseJSON;
      let msg = result.errors;
      toastr.error(msg);
    }
  });
}

var timeInterval;

function manageResult(mainData, data, currentDrawnumber) {
  let genNum = data.SYSTEM_GEN_NUMS;
  let genNumbers = genNum.split(",");
  let i = 0;
  timeInterval = setInterval(() => {
    if (i > 5) {
      setStatitics(mainData);
      clearResultTime(mainData, genNumbers, currentDrawnumber);
      return 0;
    }

    $(".ran-gen-num").text(genNumbers[i]);
    $(".g-r-s").fadeIn(2000);
    $(".g-r-s").fadeOut(2000);

    if (i < 5) {
      $(`.l-${genNumbers[i]}`).css("background-color", "blue");
    } else {
      $(`.r-${genNumbers[i]}`).css("background-color", "red");
    }

    i++;
  }, 1000);
}

function clearResultTime(mainData, genNumbers, currentDrawnumber) {
  clearInterval(timeInterval);
  $(".ran-gen-num").text("End");
  setTimeout(() => {
    for (let i = 0; i < 6; i++) {
      if (i < 5) {
        $(`.l-${genNumbers[i]}`).css("background-color", "white");
      } else {
        $(`.r-${genNumbers[i]}`).css("background-color", "white");
      }
    }

    createNextDrawTable(mainData);
    createUpcomingTable(mainData);
    createCompletedTable(mainData);
    setStatitics(mainData);
    ;
  }, 5000);
  showResult(mainData, genNumbers, currentDrawnumber);
}

function startTimer(timeLeft, TIME_LIMIT, timePassed, nextDrawNumber) {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
    setCircleDasharray(timeLeft, TIME_LIMIT);
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp(nextDrawNumber);
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds} `;
  }

  return `${minutes}: ${seconds} `;
}

function setRemainingPathColor(timeLeft) {
  const {
    alert,
    warning,
    info
  } = COLOR_CODES;

  if (timeLeft <= alert.threshold) {
    document.getElementById("base-timer-path-remaining").classList.remove(warning.color);
    document.getElementById("base-timer-path-remaining").classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document.getElementById("base-timer-path-remaining").classList.remove(info.color);
    document.getElementById("base-timer-path-remaining").classList.add(warning.color);
  }
}

function calculateTimeFraction(timeLeft, TIME_LIMIT) {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - 1 / TIME_LIMIT * (1 - rawTimeFraction);
}

function setCircleDasharray(timeLeft, TIME_LIMIT) {
  const circleDasharray = `${(calculateTimeFraction(timeLeft, TIME_LIMIT) * FULL_DASH_ARRAY).toFixed(0)} 283`;
  document.getElementById("base-timer-path-remaining").setAttribute("stroke-dasharray", circleDasharray);
}

function initTimer() {
  let d = new Date();
  let hours = d.getHours();
  let min = d.getMinutes();
  let q = min % 4;
  let nextDrawNumber = Math.ceil((hours * 60 + min) / 4);
  let nextTimer = 4 - q;
  let seconds = d.getSeconds();
  let totalSecond = (hours * 60 + min) * 60 + seconds;
  let timeLeft = totalSecond + nextTimer * 60 - totalSecond - seconds;
  let timePassed = 240 - timeLeft;
  setHtml(timeLeft);
  startTimer(timeLeft, 240, timePassed, nextDrawNumber);
}

$('#selectType').on('change', function () {
  if (this.value === 'self') {
    $("#numberOfRows").prop('disabled', true);
  } else {
    $("#numberOfRows").prop('disabled', false);
  }
});
$('.login').on('click', '.buyPlan', function () {
  $("#planModal").modal("show");
});

function buyPlan(planName) {
  let response = localStorage.getItem("response");
  response = JSON.parse(response);

  if (!response) {
    $("#planModal").modal("hide");
    $("#loginModal").modal("show");
    toastr.error("Please Login first then you can buy plan!");
  }

  ;
  const data = {
    planName
  };
  $('.b-button').prop('disabled', true);

  if (planName == 'basic') {
    $(".basic").text('Please Wait...');
  } else {
    $(".pro").text('Please Wait...');
  }

  $.ajax({
    type: 'POST',
    contentType: "application/json",
    headers: {
      'Authorization': `Bearer ${response.token}`
    },
    dataType: 'json',
    data: JSON.stringify(data),
    url: 'api/plan/buyPlan',
    success: function (result) {
      $('.b-button').prop('disabled', false);
      $(".b-button").text('Buy');
      window.location = result.data.link;
    },
    error: function (response) {
      let result = response.responseJSON;
      let msg = result.errors;
      $('.b-button').prop('disabled', false);
      $(".b-button").text('Buy');
      $(".allerror").text(msg);
    }
  });
}

function showNotification() {
  const val = $(".wrapper").attr("data-test");

  if (val === 'success') {
    toastr.success("You buy plan successfully...!");
    let response = localStorage.getItem("response");
    response = JSON.parse(response);
    response.is_premium = 1;
    response = JSON.stringify(response);
    localStorage.removeItem("response");
    localStorage.setItem("response", response);
    manageHeader();
    setTimeout(function () {
      window.location = '/';
    }, 2000);
  }

  if (val === 'cancel') {
    toastr.error("oops,you cancel the payment");
  }
}

showNotification();

if (isPremium()) {
  getUserData();
}

function setStatitics(Idata) {
  let itemStudied = Idata.length || 0;
  let itemMastered = 0;
  let itemCreated = 0;
  let goalCreated = 0;
  let journalWriiten = 0;

  for (let i = 0; i < Idata.length; i++) {
    if (Idata[i].result == 'W') {
      itemMastered++;
    }
  }

  itemCreated = itemStudied - itemMastered;
  $(".total-is").text(itemStudied);
  $(".total-im").text(itemMastered);
  $(".total-ic").text(itemCreated);
  $(".total-gc").text(goalCreated);
  $(".total-jw").text(journalWriiten);
}

initTimer();