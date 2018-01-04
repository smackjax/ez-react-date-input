# ez-react-date-input
###### *"It's an input, not a picker!"*

...not that I have anything against date pickers, but I just wanted something simple looking that could serve its purpose on small phone screens too. 
And then I remembered nothing is simple.
So if this helps someone else, then awesome. 

## Usage
`npm install --save ez-react-date-input`

``` javascript
import {
    DateInput,
    DateInputWithLabel
} from 'ez-react-date-input';

<DateInput
id="myDateInput"
className="myDateInputClass"
invalidColor="#d65151"

value="Aug 22, 2004"
inputFormat="MMM DD, YYYY"
onChange={customHandleChange}
name="myFormName"

outputFormat="YYYY-MM-DD"
formFormat="YYYY-MM-DD"

minYear={2004}
maxYear={2004}

valueOnMount={false}
validateFunc={customValidate}
/>

<DateInputWithLabel 
{/*^Everything from DateInput */}
className=""
id=""
labelText="from"
/>

```

### Important stuff
* **If 'value' is set** then onChange *must* update the source of 'value'. Otherwise, value will overwrite input changes.
* Default input and output formats are 'YYYY-MM-DD'.
``` javascript
/* onChange will get this object */
{
    value: /*2004-08-22*/,
    isValid: /*true*/,
    name: /*myFormName*/,

    year: /*2005*/,
    month: /*03*/,
    date: /*20*/
}
```

---
## References
### props
##### `<DateInput>`
Children classNames are "date-input date", "date-input month", "date-input year", and "hidden-form-value"
* **id** - Given to wrapper. (id) + ("-date", "-month", "-year) is given to the inputs for label handling.
* **className** - Given to wrapper, appended onto "date-input-wrapper"
* **invalidColor** - Must be a css string color value(hex, rgb(), 'orange'). Applied to input font if they're invalid.

* **value** - Date value to be parsed, then initialized into inputs
* **onChange** - Passed an object on each input change
* **name** - Form name for hidden input

The 'format' props take any strings that can be passed into [moment.format](https://momentjs.com/docs/#/displaying/format/)
All default to "YYYY-MM-DD"
* **inputFormat** - Format for parsing props.value
* **outputFormat** - Format for the returned (results).value into onChange
* **formFormat** - Format to store in formInput

* **minYear** - Minimum allowed year
* **maxYear** - Maximum allowed year

* **valueOnMount** - When 'true', the onChange function will be run on component mount. If no value is passed in to set initial date, will default to the present date.
* **validateFunc** - Recieves a moment object built from the current state values as final 'isValid' check, before onChange result. Must return true if valid, false if not.


##### `<DateInputWithLabel>`
* ^All the props from DateInput
* **id** - Given to container label. Inner input will get (id)+"-input"
* **className** - Given to container label, appended to "date-input-label-wrapper ". Inner input will get (className)+"-input"
* **labelText** - Placed before the string output.
---

### Default classNames
##### `<DateInput />`
* **date-input-wrapper** - Main wrapper

###### Input children classNames
* **date-input date** - "date input `<input type="text">`"
* **date-input month** - "month select list `<select>`"
* **date-input year** - "year input `<input type="text">`"

##### `<DateInputWithLabel>`
* **date-input-label-wrapper** - Main label wrapper
* **date-output-wrapper** - Wraps label text `<span>` and date output `<span>`
* **date-label-text** - `<span>` Holding label text
* **date-value-output** - `<span>` With result of date input change
---

##### *"What's with the 'ez'?"*
react-date-input was taken, that's it. No snark intended.