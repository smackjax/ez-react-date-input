import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './date-input.style.css';

// Checks number from textbox for letter characters
const hasOnlyNumbs=(number)=>{
    const numbStr = ''+number;
    const chars = numbStr.split();
    let onlyNumbs = true;
    chars.forEach((char)=>{
      if(isNaN(char)){
          onlyNumbs = false;
      } 
    });
    return onlyNumbs;
}

class DateSelectInput extends React.Component{

    state={
        dateVal: "",
        monthVal: "",
        yearVal: "",
        currentValue: ""
    }

    componentWillMount(){
        // Sets initial input values
        this.setValue(this.props, ()=>{
            if(this.props.valueOnMount){
                this.handleChange();
            }
        });
    }

    // Checks for props.value
    componentWillReceiveProps(newProps){

        if(newProps.value){
            this.setValue(newProps);
        }
    }

    // Sets values of all inputs if props.value
    // OR initializes with current date if valueOnMount
    // OR only initializes 'month' to current
    setValue=(props, callback)=>{
        const dateFormat = props.inputFormat || 'YYYY-MM-DD'       

        // Checks if a value was passed in
        const value =
            props.value ?
                // Checks if val is a moment obj
                moment.isMoment(props.value) ? 
                    props.value :
                // If not a moment obj, check if valid parse string with inputFormat
                moment(props.value, dateFormat) :          
            // If no props.value, just make null
           null;

        const currentDate = moment();

        const dateVal = 
            value ?
                value.format("DD") : 
            props.valueOnMount ?
                currentDate.format("DD") : 
            "";
        
        const monthVal = 
            value ? 
                value.format("MM") :
            currentDate.format("MM") ;

        const yearVal = 
            value ? 
                value.format("YYYY") :
            props.valueOnMount ?
                currentDate.format("YYYY") : 
            "";

        // Initializes hidden input
        const formFormat = this.props.formFormat || "YYYY-MM-DD";
        const currentValue = 
            value ?
                value.format(formFormat) : 
            props.valueOnMount ?
                moment().format(formFormat) :
            "";
        
        this.setState({
            dateVal,
            monthVal,
            yearVal,
            currentValue
        }, ()=>{
            if(callback) callback();
        });
    }

    // Runs after any input changes
    handleChange=()=>{
        const day = this.state.dateVal;
        const month = this.state.monthVal;
        const year = this.state.yearVal; 
        const yearLength = (year.length === 4);
        const invalidColor = this.props.invalidColor;

        // Attempt to create date
        const dateString = `${year}-${month}-${day}`; 
        // This format doesn't change because it's handling from this.state
        const newDate = moment(dateString, "YYYY-MM-DD");

        
        // Checks if date from state is valid
        const dateValid = newDate.isValid();
        // Checks day and month text for letters
        const dayNumbs = hasOnlyNumbs(day);
        const yearNumbs = hasOnlyNumbs(year);
        // Checks if outside either min or max year
        const maxYear = (this.props.maxYear ? 
            (parseInt(year, 10) <= this.props.maxYear) : true );
        const minYear = (this.props.minYear ? 
            (parseInt(year, 10) >= this.props.minYear) : true );
        // Checks custom validate function
        const customValidate = (this.props.validateFunc ? 
            this.props.validateFunc(newDate) : true );

        let isValid = (
            dateValid &&
            day &&
            month && 
            year &&
            yearLength &&
            dayNumbs && 
            yearNumbs && 
            maxYear && 
            minYear &&
            customValidate
        ) ? true : false;

        // Sets 'date' to invalid color
        const dateElem = this.refs.dateSelectDay;
        const compareString = `${year}-${month}-01`;

        const compareDate = 
            moment(compareString, "YYYY-MM-DD").endOf('month').date();
            
        dateElem.style.color =
        (   // If a char is not a number
            !hasOnlyNumbs(day) || 
            // Or if all fields set
            ((year && yearLength && month && day) &&        
            // and date is later than possible
            (parseInt(day, 10) > compareDate))
        ) ? 
        // Set to invalid color
        (invalidColor || "") : 
        // Or if all conditions pass, set to blank
        "" ;

        // Sets year font color
        const yearElem = this.refs.dateSelectYear;
        yearElem.style.color = ( 
            // If only numbers
            yearNumbs &&
            // And not too late
            maxYear &&
            // Or too early
            minYear 
        ) ? // Then border is blank
            '' : // OR
        // If there was an invalid condition, check for invalid color prop
        invalidColor || "" ;

        const outputFormat =
            this.props.outputFormat ||
                'YYYY-MM-DD';

        // Sets .value of returned object to onChange
        const returnStr =
            (!minYear && yearNumbs && yearLength) ? "Choose later year" :
            (!maxYear && yearNumbs && yearLength) ? "Choose earlier year" :
            (parseInt(day, 10) > compareDate) ? "Choose earlier date" :
            (parseInt(day, 10) <= 0) ? "Choose later date" :
            (day.length === 0) ? "Date required" :
            !yearLength ? "Full year required":
            (!isValid || !(day && month && year && yearLength))  ? 'Invalid date' :
            newDate.format(outputFormat);

        const inputName = this.props.name || "";

        const formFormat = this.props.formFormat || "YYYY-MM-DD";
        const currentValue = newDate.format(formFormat);

        this.setState({
            currentValue
        }, ()=>{
            // Prevents update during render
            if(this.props.onChange){
                this.props.onChange(
                    // Returned object
                    {
                        value: returnStr,
                        isValid,
                        name: inputName,
    
                        year: this.state.yearVal,
                        month: this.state.monthVal,
                        date: this.state.dateVal
                    }
                );
            }
        });
    }

    handleDay=(e)=>{
        let dateVal = e.target.value;
        this.setState(
            { dateVal },
            this.handleChange
        );
    }

    handleMonth=(e)=>{
        const monthVal = e.target.value;
        this.setState(
            { monthVal }, 
            this.handleChange
        );
    }

    handleYear=(e)=>{
        const yearVal = e.target.value;
        this.setState(
            { yearVal },
            this.handleChange    
        );
    }

    render(){
        const wrapperClassName = 
            "date-input-wrapper " +
                (this.props.className || "");

        // Sets input ids for htmlFor
        const dateId = 
            this.props.id ? 
                (this.props.id + "-date") :
            "";
        const monthId = 
            this.props.id ? 
                (this.props.id + "-month") :
            "";
        const yearId = 
            this.props.id ? 
                (this.props.id + "-year") :
            "";

        return(
        <div
        ref="dateSelectWrapper"
        id={this.props.id || ""}
        className={wrapperClassName}>

            <select 
            ref="dateSelectMonth"
            id={monthId}
            value={this.state.monthVal} 
            onChange={this.handleMonth} 
            className="date-input month">
                <option value="01">Jan</option>
                <option value="02">Feb</option>
                <option value="03">Mar</option>
                <option value="04">Apr</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">Aug</option>
                <option value="09">Sep</option>
                <option value="10">Oct</option>
                <option value="11">Nov</option>
                <option value="12">Dec</option>
            </select>

            <input type='text' 
            id={dateId}
            ref="dateSelectDay"
            onChange={this.handleDay} 
            className="date-input date" 
            maxLength="2"
            placeholder='DD'
            value={this.state.dateVal}/>

            <input type='text'
            id={yearId}
            ref="dateSelectYear"
            onChange={this.handleYear} 
            className="date-input year"
            maxLength="4"
            placeholder={'YYYY'}
            value={this.state.yearVal} />

        <input type="text"
        className="hidden-form-value"
        aria-hidden
        readOnly
        value={this.state.currentValue}
        name={(this.props.name || "")}
        tabIndex="-1"
        style={{
            width: '0px',
            height: '0px',
            display: 'none'
        }}/>
        </div>
        )
    }
}

DateSelectInput.propTypes={
    className: PropTypes.string,
    id: PropTypes.string,
    invalidColor: PropTypes.string,

    value: PropTypes.string,
    onChange: PropTypes.func,
    name: PropTypes.string,
    
    minYear: PropTypes.number,
    maxYear: PropTypes.number,

    inputFormat: PropTypes.string,
    outputFormat: PropTypes.string,
    formFormat: PropTypes.string,

    valueOnMount: PropTypes.bool,
    validateFunc: PropTypes.func
}

export default DateSelectInput;