var select_name;
var select_catalog = {};
var delete_chip_function =
  "delete_chip($(this).attr('value'), $(this).attr('select_name'))";
var add_chip_function =
  "add_chip(this, $(this).first(), $(this).attr('value'))";

// creates the HTML content of the chips in case there are pre-selected elements on loading
function create_chips(select_name_arg, data) {
  var html_content = ``;
  for (var i = 0; i < data.length; i++) {
    if (data[i].select == true) {
      html_content += `<div value="${data[i].value}">
          <span>${data[i].text}</span>
          <span class="delete-chip material-icons" value="${data[i].value}" select_name="${select_name_arg}" onclick="${delete_chip_function}">close</span>
        </div>`;
    }
  }
  return html_content;
}

//creates the HTML content of the options
function create_options(select_name_arg, data) {
  var html_content = "";
  for (var i = 0; i < data.length; i++) {
    if (data[i].select == true) {
      html_content += `<div class="option select" value="${data[i].value}" select_name="${select_name_arg}" onclick="${delete_chip_function}">`;
    } else {
      html_content += `<div class="option" value="${data[i].value}" select_name="${select_name_arg}" onclick="${add_chip_function}">`;
    }
    html_content += `
          <div class="option-text">${data[i].text}</div>
          <div class="check-mark">
            <span class="material-icons-outlined">close</span>
          </div>
        </div>`;
  }
  return html_content;
}

function select_constructor(select_name_arg, data, config) {
  if (!config) config = {};
  try {
    if (config.placeholder == undefined) config.placeholder = "Cerca";
    data_validator(select_name_arg, data, "constructor");
    var html_chips = create_chips(select_name_arg, data);
    var html_content = `<div class="selected">
      <div class="chips">
        ${html_chips}
      </div>
      <input type="text" class="text-input add_personal_chip" placeholder="${
        config.placeholder
      }" select_name="${select_name_arg}"
      onfocus="show_options_list($(this).attr('select_name'))" 
      onkeyup="options_filter($(this).attr('select_name'), this.value)">
    </div>
    <div class="options-list hide">
      ${create_options(select_name_arg, data)}
    </div>`;

    $(`[select_name=${select_name_arg}]`).append(html_content);

    //set config options
    if (config.add_personal_chip == false) {
      $(`[select_name=${select_name_arg}] .text-input`).removeClass(
        "add_personal_chip"
      );
    }
    if (config.autocomplete == false) {
      $(`[select_name=${select_name_arg}] .text-input`).removeAttr("onkeyup");
    }

    select_catalog[select_name_arg] = {};
    if (typeof config.max_selections == "number")
      select_catalog[select_name_arg].max_selections = config.max_selections;

    if (config.onchange != undefined && config.onchange != "")
      select_catalog[select_name_arg]["onchange"] = config.onchange;

    if (config.onkeyup != undefined && config.onkeyup != "")
      select_catalog[select_name_arg]["onkeyup"] = config.onkeyup;

    //css
    set_input_with();
  } catch (error) {
    alert(`errore nel selettore chiamato "${select_name_arg}"\n${error}`);
    $(`[select_name=${select_name_arg}]`).append(
      "errore nell'inserimento delle opzioni"
    );
  }
}

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
    if (e.path[i].className != undefined) {
      if (e.path[i].className.includes("multiple-select-chip")) {
        out = false;
        old_select_name = new_select_name;
        break;
      }
    }
  }
  if (out) {
    $(`[select_name="${new_select_name}"] .options-list`).addClass("hide");
  }
};

function add_chip(this_div, children, value, select_name_arg) {
  try {
    if (!select_name_arg) select_name_arg = select_name;
    check_limit(select_name_arg);
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

    //css
    set_input_with();
    //call a personal function
    if (select_catalog[select_name_arg].onchange != undefined)
      window[select_catalog[select_name_arg].onchange]();
  } catch (error) {
    alert(error);
  }
}

function delete_chip(value, select_name_arg) {
  $(`[select_name=${select_name_arg}] .chips > div[value="${value}"]`).remove();

  $(`[select_name=${select_name_arg}] .option[value="${value}"]`)
    .removeClass("select")
    .attr("onclick", add_chip_function);

  //call a personal function
  if (select_catalog[select_name_arg].onchange != undefined)
    window[select_catalog[select_name_arg].onchange]();
  //css
  set_input_with();
}

document.addEventListener("keydown", onKeyPressed);
function onKeyPressed(e) {
  var key = e.key;
  if (
    key == "Enter" &&
    $(`[select_name=${select_name}]  .text-input`).is(":focus") == true &&
    $(`[select_name=${select_name}]  .text-input`).hasClass(
      "add_personal_chip"
    ) == true
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

//creates the HTML content of the options
function options_filter(select_name_arg, text) {
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

  //css
  $(`[select_name=${select_name}] .option`).removeClass(
    "top-border bottom-border"
  );
  $(`[select_name=${select_name}] .option:not(.hide)`)
    .first()
    .addClass("top-border");
  $(`[select_name=${select_name}] .option:not(.hide)`)
    .last()
    .addClass("bottom-border");

  // call a personal function
  if (select_catalog[select_name_arg].onkeyup != undefined)
    window[select_catalog[select_name_arg].onkeyup]();
}

//adds new options
function new_datas(select_name_arg, data, mod) {
  // there are 2 ways to add new options:
  // 1) mod == "replace" -> delete all other already existing options (DEFAULT)
  // 2) mod == "add" -> adds new options to the end of existing ones
  if (!mod) mod = "replace";

  try {
    data_validator(select_name_arg, data, mod);
    var html_chips = create_chips(select_name_arg, data);
    var html_options = create_options(select_name_arg, data);
    if (mod == "replace") {
      $(`[select_name=${select_name_arg}] .options-list`).replaceWith(
        '<div class="options-list hide">' + html_options + "</div>"
      );

      $(`[select_name=${select_name_arg}] .chips > div`).remove();
      $(`[select_name=${select_name_arg}] .chips`).append(` ${html_chips} `);
    }
    if (mod == "add") {
      $(`[select_name=${select_name_arg}] .options-list`).append(html_options);
      $(`[select_name=${select_name_arg}] .chips`).append(` ${html_chips} `);
    }
  } catch (error) {
    alert(`errore nel selettore chiamato "${select_name_arg}"\n${error}`);
    $(`[select_name=${select_name_arg}]`).replaceWith(
      "errore nell'inserimento delle opzioni"
    );
  }
}

function get_value(select_name_arg) {
  var selected_info = {
    all: check_all_selected(),
    names: [],
    values: [],
    added_values: [],
  };
  var chips_number = $(`[select_name=${select_name_arg}] .chips`).children()
    .length;
  for (var i = 1; i < chips_number + 1; i++) {
    var val = $(
      `[select_name=${select_name_arg}] .chips > div:nth-child(${i})`
    ).attr("value");
    selected_info.values.push(val);

    var text = $(
      `[select_name=${select_name_arg}] .chips > div:nth-child(${i}) > span:nth-child(2)`
    ).html();
    selected_info.names.push(text);

    if (
      $(`[select_name=${select_name_arg}] .options-list > div[value=${val}]`)
        .length == 0
    ) {
      selected_info.added_values.push(val);
    }
  }
  return selected_info;
}

function check_all_selected(select_name_arg) {
  var all_selected = true;
  var options_number = $(
    `[select_name=${select_name_arg}] .options-list`
  ).children().length;
  for (var i = 1; i < options_number + 1; i++) {
    var div_in_use = `[select_name=${select_name_arg}] .options-list > div:nth-child(${i})`;
    if ($(div_in_use).hasClass("select") == false) {
      all_selected = false;
      break;
    }
  }
  return all_selected;
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

function deselect_all(select_name_arg, forced) {
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

function check_limit(select_name_arg) {
  var chips_number = $(`[select_name=${this.select_name}] .chips`).children()
    .length;

  var max_selections = select_catalog[select_name_arg].max_selections;
  if (chips_number == max_selections)
    throw "Limite di elementi selezionabili raggiunto";
}

// SET THE WITH OF THE INPUT TEXT
function set_input_with() {
  var options_number = $(`div.multiple-select-chip[select_name]`).length;
  for (var i = 0; i < options_number; i++) {
    var chips_width = $(
      `div.multiple-select-chip[select_name]:eq(${i}) .chips`
    ).width();
    var selected_width = $(
      `div.multiple-select-chip[select_name]:eq(${i}) .selected`
    ).width();
    var delta_width = selected_width - chips_width;
    if (delta_width > 100) {
      $(`div.multiple-select-chip[select_name]:eq(${i}) .text-input`).css(
        "width",
        delta_width
      );
    } else {
      $(`div.multiple-select-chip[select_name]:eq(${i}) .text-input`).css(
        "width",
        "100px"
      );
    }
  }
}

$(window).resize(function () {
  set_input_with();
});

class select {
  //method to call the function without putting the select_name as a parameter

  constructor(querySelector, data, config) {
    this.select_name = querySelector;
    select_constructor(this.select_name, data, config);
  }

  create_chips(data) {
    create_chips(this.select_name, data);
  }

  create_options(data) {
    create_options(this.select_name, data);
  }

  new_data(data, mod) {
    new_datas(this.select_name, data, mod);
  }

  get_value() {
    get_value(this.select_name);
  }

  check_all_selected() {
    check_all_selected(this.select_name);
  }

  select_all() {
    select_all(this.select_name);
  }

  deselect_all(forced) {
    deselect_all(this.select_name, forced);
  }
}
