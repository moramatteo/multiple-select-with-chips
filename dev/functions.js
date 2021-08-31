var select_name;
var delete_chip_function =
  "delete_chip($(this).attr('value'), $(this).attr('select_name'))";
var add_chip_function =
  "add_chip(this, $(this).first(), $(this).attr('value'))";

function show_options_list(name) {
  $(`[select_name=${name}] > .options-list`).removeClass("hide");
  select_name = name;
}

//when the click is outside the element, the list of options is hidden
var old_select_name;
document.onclick = function (e) {
  var out = true;
  var new_select_name = select_name;
  //old_select_name must be different from undefined because the first time the function is called it has never been defined
  if (old_select_name != new_select_name && old_select_name != undefined)
    $(`[select_name="${old_select_name}"] .options-list`).addClass("hide");
  for (var i = 0; i < e.path.length; i++) {
    if (e.path[i].className == "multiple-select-chip") {
      out = false;
      old_select_name = new_select_name;
      break;
    }
  }
  if (out) {
    $(`[select_name="${new_select_name}"] .options-list`).addClass("hide");
  }
};

function add_chip(this_div, children, value, select_name_arg) {
  try {
    if (!select_name_arg) select_name_arg = select_name;
    if (this_div != "") {
      //if the function is called by clicking the options
      var text = children[0].firstChild.nextSibling.innerText;
      $(this_div).addClass("select");
    } else {
      //if the function is called by the ENTER key
      var text = value;
      data_validator(select_name_arg, text, "enter");
    }

    $(`[select_name=${select_name_arg}] .chips`).append(`
    <div value="${value}">
      <span>${text}</span>
      <span class="delete-chip material-icons" value="${value}" select_name="${select_name_arg}" onclick="${delete_chip_function}">close</span>
    </div>
  `);

    $(this_div).attr("onclick", `${delete_chip_function}`);

    set_input_with();
  } catch (error) {
    alert(error);
  }
}

function delete_chip(value, select_name_arg) {
  $(`[select_name=${select_name_arg}] .chips > div[value="${value}"]`).remove();

  $(`[select_name=${select_name_arg}] .option[value="${value}"]`)
    .removeClass("select")
    .attr("onclick", add_chip_function);

  set_input_with();
}

document.addEventListener("keydown", onKeyPressed);

function onKeyPressed(e) {
  var key = e.key;
  if (
    key == "Enter" &&
    $(`[select_name=${select_name}]  .text-input`).is(":focus") == true &&
    $(`[select_name=${select_name}]  .text-input`).hasClass("add_personal_chip") == true
  ) {
    var value = $(`.text-input[select_name=${select_name}]`).val();
    if (value != "") {
      $(".text-input").val("").blur();
      add_chip("", "", value);
      // after typing, make the options visible for later viewing
      $(`[select_name=${select_name}] .option`).removeClass("hide");
      $(`[select_name=${select_name}] .options-list`).addClass("hide");
    }
  }
}

function options_filter(text) {
  if (text == "")
    //when the input field is empty, all options must be seen
    $(`[select_name=${select_name}] .option`).removeClass("hide");
  else {
    var options_number = $(
      `[select_name=${select_name}] .options-list`
    ).children().length;
    //initial value of the loop variable = 1 because the first child has a value of 1
    for (var i = 1; i < options_number + 1; i++) {
      if (
        //compares the text of each option with the input text
        $(`[select_name=${select_name}] .option:nth-child(${i}) > .option-text`)
          .html()
          .toLowerCase()
          .indexOf(text.toLowerCase()) == -1
      ) {
        // if there is no match
        $(`[select_name=${select_name}] .option:nth-child(${i})`).addClass(
          "hide"
        );
      } else {
        //if there is a match
        $(`[select_name=${select_name}] .option:nth-child(${i})`).removeClass(
          "hide"
        );
      }
    }
  }
  $(`[select_name=${select_name}] .option`).removeClass(
    "top-border bottom-border"
  );

  $(`[select_name=${select_name}] .option:not(.hide)`)
    .first()
    .addClass("top-border");

  $(`[select_name=${select_name}] .option:not(.hide)`)
    .last()
    .addClass("bottom-border");
}

function select_all(select_name_arg) {
  if (!select_name_arg) select_name_arg = select_name;
  var options_number = $(
    `[select_name=${select_name_arg}] .options-list`
  ).children().length;
  for (var i = 1; i < options_number + 1; i++) {
    var div_in_use = `[select_name=${select_name_arg}] .options-list > div:nth-child(${i})`;
    if ($(div_in_use).hasClass("select") == true) {
      continue;
    } else {
      add_chip(
        $(div_in_use),
        $(div_in_use).first(),
        $(div_in_use).attr("value"),
        select_name_arg
      );
    }
  }
}

function deselect_all(forced, select_name_arg) {
  if (!select_name_arg) select_name_arg = select_name;
  var options_number = $(
    `[select_name=${select_name_arg}] .options-list`
  ).children().length;
  for (var i = 1; i < options_number + 1; i++) {
    var div_in_use = `[select_name=${select_name_arg}] .options-list > div:nth-child(${i})`;
    if ($(div_in_use).hasClass("select") == false) {
      continue;
    } else {
      $(div_in_use).removeClass("select");
      delete_chip($(div_in_use).attr("value"), select_name_arg);
    }
  }
  if (forced == "forced") {
    $(`[select_name=${select_name_arg}] .chips > div`).remove();
  }
}

function data_validator(select_name, data, mod) {
  var all_value = [];

  if (mod == "enter") {
    //chips check
    var chips_number = $(`[select_name=${select_name}] .chips`).children()
      .length;
    for (var i = 1; i < chips_number + 1; i++) {
      var div_in_use = `[select_name=${select_name}] .chips > div:nth-child(${i})`;
      var val = $(div_in_use).attr("value");
      all_value.push(val);
      if (all_value.includes(data)) {
        throw "valore già selezionato";
      }
    }

    //options' value check
    var options_number = $(
      `[select_name=${select_name}] .options-list`
    ).children().length;
    for (var i = 1; i < options_number + 1; i++) {
      var div_in_use = `[select_name=${select_name}] .options-list > div:nth-child(${i})`;
      var val = $(div_in_use).attr("value");
      all_value.push(val);
      if (all_value.includes(data)) {
        throw "c'è già una opzione con questo valore";
      }
    }
  }

  if (mod == "constructor" || mod == "replace") {
    for (var i = 0; i < data.length; i++) {
      //check if neither the text nor the value are missing
      if (data[i].text == undefined || data[i].text == "")
        throw `Non è stato impostato nessun testo per il valore "${data[i].value}"`;
      if (data[i].value == undefined || data[i].value == "")
        throw `Non è stato impostato nessun valore per il testo "${data[i].text}"`;

      //check if there are no duplicate values
      if (all_value.includes(data[i].value))
        throw "Ci sono dei valori duplicati";
      else all_value.push(data[i].value);
    }
  }

  if (mod == "add") {
    data_validator(select_name, data, "replace");

    //aggiunge all'array tutti chips
    var chips_number = $(`[select_name=${select_name}] .chips`).children()
      .length;
    for (var i = 1; i < chips_number + 1; i++) {
      var div_in_use = `[select_name=${select_name}] .chips > div:nth-child(${i})`;
      var val = $(div_in_use).attr("value");
      all_value.push(val);
    }

    //aggiunge all'array tutti i valori delle opzioni
    var options_number = $(
      `[select_name=${select_name}] .options-list`
    ).children().length;
    for (var i = 1; i < options_number + 1; i++) {
      var div_in_use = `[select_name=${select_name}] .options-list > div:nth-child(${i})`;
      var val = $(div_in_use).attr("value");
      all_value.push(val);
    }

    //controlla se ogni valore è presente nell'array
    for (var i = 0; i < data.length; i++) {
      if (all_value.includes(data[i].value)) {
        throw "Ci sono dei valori duplicati";
      }
    }
  }
}

// SET THE WITH OF THE INPUT TEXT
function set_input_with() {
  var options_number = $(`div[select_name]`).length;
  for (var i = 0; i < options_number; i++) {
    var chips_width = $(`div[select_name]:eq(${i}) .chips`).width();
    var selected_width = $(`div[select_name]:eq(${i}) .selected`).width();
    var delta_width = selected_width - chips_width;
    if (delta_width > 100) {
      $(`div[select_name]:eq(${i}) .text-input`).css("width", delta_width);
    } else {
      $(`div[select_name]:eq(${i}) .text-input`).css("width", "100px");
    }
  }
}

$(window).resize(function () {
  set_input_with();
});
