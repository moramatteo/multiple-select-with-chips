var select_name;
var delete_chip_function =
  "delete_chip($(this).attr('value'), $(this).attr('select_name'))";
var add_chip_function =
  "add_chip(this, $(this).first(), $(this).attr('value'))";

function show_options_list(name) {
  $(`[select_name=${name}] > .options-list`).removeClass("hide");
  Mousetrap.unpause();
  select_name = name;
}

//quando il click è fuori dal l'elemento, l'elenco viene nascosto
document.onclick = function (e) {
  var out = true;
  for (var i = 0; i < e.path.length; i++) {
    if (
      e.path[i].className == "multiple-select-chip"
      //! && e.path[i].attributes.select_name.value == select_name
    ) {
      out = false;
      break;
    }
  }
  if (out) {
    $(".options-list").addClass("hide");
    Mousetrap.pause();
  }
};

function add_chip(this_div, children, value, select_name_arg) {
  try {
    if (!select_name_arg) select_name_arg = select_name;
    if (this_div != "") {
      //se la funzione è chiamata dal click delle opzioni
      var text = children[0].firstChild.nextSibling.innerText;
      $(this_div).addClass("select");
    } else {
      //se la funzione è chimata dall'invio nell'input
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

Mousetrap.bind("enter", function (e) {
  var value = $(`.text-input[select_name=${select_name}]`).val();
  if (value != "") {
    $(".text-input").val("").blur();
    add_chip("", "", value);
    // finita la digitazione rendere mostrabile le opzioni per una successiva visione
    $(`[select_name=${select_name}] .option`).removeClass("hide");
    $(`[select_name=${select_name}] .options-list`).addClass("hide");
  }
});

//valore iniziale
Mousetrap.pause();

function options_filter(text) {
  if (text == "")
    //quando il campo di input è vuoto, si devono vedere tutte le opazioni
    $(`[select_name=${select_name}] .option`).removeClass("hide");
  else {
    var options_number = $(
      `[select_name=${select_name}] .options-list`
    ).children().length;
    // valore iniziale della varibile del ciclo = 1 perché il primo child ha come valore 1
    for (var i = 1; i < options_number + 1; i++) {
      if (
        //compara il testo di ogni opzione con il testo di input
        $(`[select_name=${select_name}] .option:nth-child(${i}) > .option-text`)
          .html()
          .toLowerCase()
          .indexOf(text.toLowerCase()) == -1
      ) {
        // se non c'è nessuna corrispondenza
        $(`[select_name=${select_name}] .option:nth-child(${i})`).addClass(
          "hide"
        );
      } else {
        //se c'è corrispondenza
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
