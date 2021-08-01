var select_name;

function show_options_list(name) {
  console.log(name)
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
      && e.path[i].attributes.select_name == select_name
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

function add_chip(this_div, children, value, name) {
  if (
    $(
      `.multiple-select-chip[select_name=${name}] > .options-list > .option[value="${value}"]`
    ).hasClass("select")
  ) {
    delete_chip(value);
  } else {
    if (this_div != "") {
      var text = children[0].firstChild.nextSibling.innerText;
      $(this_div).addClass("select");
    } else {
      var text = value;
    }

    $(`[select_name=${name}] > .selected > .chips`).append(`
    <div value="${value}">
      <span class="delete-chip" value="${value}" onclick="delete_chip($(this).attr('value'))">X</span>
      <span>${text}</span>
    </div>
  `);
  }
}

function delete_chip(value) {
  console.log("can");
  $(
    `.multiple-select-chip[select_name=${select_name}] > .selected > .chips > div[value="${value}"]`
  ).remove();
  $(
    `.multiple-select-chip[select_name=${select_name}] > .options-list > .option[value="${value}"]`
  ).removeClass("select");
}

// CREA NUOVO
// var pippo_data = [
//   { text: "prova1", value: "val1" },
//   //!AGGIUNGERE AUTO SELEZIONE
//   { text: "prova2", value: "val2", select: true },
//   { text: "prova3", value: "val3" }
// ];
// var pippo = new select(".multiple-select-chip", pippo_data);

// // MODIFICA OPZIONI
// var new_data = [
//   { text: "ciao1", value: "cia1" },
//   { text: "ciao2", value: "cia2" },
// ];
// pippo.new_data(new_data)

Mousetrap.bind("enter", function (e) {
  var value = $(`[select_name=${select_name}] .text-input`).val();
  if (value != "") {
    $(".text-input").val("").blur();
    add_chip("", "", value, select_name);
    $(`.option[select_name=${select_name}]`).removeClass("hide");
    $(
      `.multiple-select-chip[select_name=${select_name}] > .options-list`
    ).addClass("hide");
  }
});

//valore iniziale
Mousetrap.pause();

function options_filter(name, text) {
  if (text == "") $(`.option[select_name=${name}]`).removeClass("hide");
  else {
    var lunghezza = $(
      `.multiple-select-chip[select_name=${name}] > .options-list`
    ).children().length;
    for (var i = 1; i < lunghezza + 1; i++) {
      if (
        $(
          `.multiple-select-chip[select_name=${name}] > .options-list > div:nth-child(${i}) > .option-text`
        )
          .html()
          .toLowerCase()
          .indexOf(text.toLowerCase()) == -1
      ) {
        $(
          `.multiple-select-chip[select_name=${name}] > .options-list > div:nth-child(${i})`
        ).addClass("hide");
      } else {
        $(
          `.multiple-select-chip[select_name=${name}] > .options-list > div:nth-child(${i})`
        ).removeClass("hide");
      }
    }
  }
}

// FOR STYLE
// var chips_width = $(".chips").width()
// var selected_width = $(".selected").width()