import React from 'react';
import { configure, shallow, mount} from 'enzyme';
import moment from 'moment';
import reactAdapter from 'enzyme-adapter-react-16';
import DateInput from './date-input.component';

configure({ adapter: new reactAdapter() });

const noOp=(results)=>{}

describe("Date select input on mount", ()=>{
    it("Renders one div wrapper", ()=>{
        const wrapper = shallow(
            <DateInput 
                onChange={noOp} 
            />
        );
        expect(wrapper.find('div').length)
        .toBe(1)
    });

    it("Renders 3 date-input classes", ()=>{
        const wrapper = shallow(
            <DateInput 
                onChange={noOp} 
            />
        );
        expect(wrapper.find('.date-input').length)
        .toBe(3)
    });

    // Tests compare output of .format
    // to ensure result
    it("Accepts props.value as YYYY-MM-DD", ()=>{
        const wrapper = shallow( 
            <DateInput 
                onChange={noOp} 
                value='2003-02-01'
            /> 
        );
        const state = wrapper.instance().state;
        const stateValStr = `${state.yearVal}-${state.monthVal}-${state.dateVal}`;
        const testDate = moment(stateValStr, "YYYY-MM-DD");

        const controlDate = moment().year(2003).month('feb').date(1);

        const compareFormat = "YYYY-MM-DD";
        expect(testDate.format(compareFormat))
        .toEqual(controlDate.format(compareFormat))
    });

    it("Accepts custom 'value' with 'inputFormat'", ()=>{
        const wrapper = shallow( 
            <DateInput 
                onChange={noOp} 
                value='01, 2006-05' 
                inputFormat="MM, YYYY-DD"
            /> 
        );
        
        const state = wrapper.instance().state;
        const stateValStr = `${state.yearVal}-${state.monthVal}-${state.dateVal}`;
        const testDate = moment(stateValStr, "YYYY-MM-DD");

        const controlDate = moment().year(2006).month('Jan').date(5);

        const compareFormat = "YYYY-MM-DD";
        expect(testDate.format(compareFormat))
        .toEqual(controlDate.format(compareFormat))
    })

    it("Default to current date if valueOnMount", ()=>{
        const wrapper = mount( 
            <DateInput 
                onChange={noOp} 
                valueOnMount={true}
            /> 
        );
        const state = wrapper.instance().state;
        const stateValStr = `${state.yearVal}-${state.monthVal}-${state.dateVal}`;
        const testDate = moment(stateValStr, "YYYY-MM-DD");

        const controlDate = moment();

        const compareFormat = "YYYY-MM-DD";
        expect(testDate.format(compareFormat))
        .toEqual(controlDate.format(compareFormat))
    })

    it("Override valueOnMount default with props.value", ()=>{
        const wrapper = mount( 
            <DateInput 
                onChange={noOp} 
                valueOnMount={true}
                value='01, 2006-05' 
                inputFormat="MM, YYYY-DD"
            /> 
        );
        const state = wrapper.instance().state;
        const stateValStr = `${state.yearVal}-${state.monthVal}-${state.dateVal}`;
        const testDate = moment(stateValStr, "YYYY-MM-DD");

        const controlDate = moment().year(2006).month('Jan').date(5);

        const compareFormat = "YYYY-MM-DD";
        expect(testDate.format(compareFormat))
        .toEqual(controlDate.format(compareFormat))
    })

    it("Has hidden input with correct value", ()=>{
        const wrapper = mount( 
            <DateInput 
                onChange={noOp} 
                value='2004-02-17'
                inputFormat="YYYY-MM-DD"
                valueOnMount
                name="woggaBogga"
            /> 
        );
        const controlDate = moment().year(2004).month("Feb").date(17);
        const hiddenInputVal = wrapper.find('.hidden-form-value').first().instance().value;

        const momentFromVal = moment(hiddenInputVal, "YYYY-MM-DD");

        const compareFormat = "YYYY-MM-DD";
        expect(momentFromVal.format(compareFormat))
        .toEqual(controlDate.format(compareFormat))
    })

})



describe("Date select input onChange", ()=>{

    it("Is invalid/valid from field input", ()=>{
        // Stores all onChange results
        let results = "unchanged";
        // Sets results
        const handleChange = (changeResults)=>{ results = changeResults; }

        // Initialize wrapper
        const Wrapper = mount(
            <DateInput
            onChange={handleChange} 
        /> 
        )

        // Get inputs
        const yearInput = Wrapper.find(".date-input.year").first();
        const dateInput = Wrapper.find(".date-input.date").first();

        // Set date
        const dateChangeEvent = {target: {value: "21"}}
        dateInput.simulate("change", dateChangeEvent);
        // No year set, should be invalid
        expect(results.isValid)
        .toEqual(false)
        
        // Set year (Month is set to current by default)
        // All fields now set, should be valid
        const yearChangeEvent = { target: { value: "2003" } };
        yearInput.simulate("change", yearChangeEvent);
        expect(results.isValid)
        .toEqual(true)

        // Compare based in moment.format()
        const testDateStr = results.value;
        const testDate = moment(testDateStr, "YYYY-MM-DD");
        const currentMonth = moment().format("MMM");
        const controlDate = moment().year(2003).month(currentMonth).date(21);

        // Compare results from state
        const compareFormat = "YYYY-MM-DD";
        expect(testDate.format(compareFormat))
        .toEqual(controlDate.format(compareFormat))
    })

    it("Is invalid if outside year ranges", ()=>{
        // Stores all onChange results
        let results = "unchanged";
        // Sets results
        const handleChange = (changeResults)=>{ results = changeResults; }

        // Initialize wrapper
        const Wrapper = mount(
            <DateInput
            value="2005-08-08"
            onChange={handleChange}
            minYear={2004}
            maxYear={2007}
        /> 
        )

        // Get inputs
        const yearInput = Wrapper.find(".date-input.year").first();
        
        // Inside low range
        const eventControlLow = { target: { value: "2004" } };
        yearInput.simulate("change", eventControlLow);
        expect(results.isValid)
        .toEqual(true)

        // Outside low range
        const eventOutsideLow = { target: { value: "2003" } };
        yearInput.simulate("change", eventOutsideLow);
        expect(results.isValid)
        .toEqual(false)

        // Inside high range
        const eventControlHigh = { target: { value: "2007" } };
        yearInput.simulate("change", eventControlHigh);
        expect(results.isValid)
        .toEqual(true)

        // Outside high range
        const eventOutsideHight = { target: { value: "2008" } };
        yearInput.simulate("change", eventOutsideHight);
        expect(results.isValid)
        .toEqual(false)
    }) 

    it("Should output correct format", ()=>{
        // Stores all onChange results
        let results = "unchanged";
        // Sets results
        const handleChange = (changeResults)=>{ results = changeResults; }

        // test format
        const outputFormat="MMM DD, YYYY";

        // Initialize wrapper
        // (date will be 20)
        const Wrapper = mount(
            <DateInput
            value="2005-08-01"
            onChange={handleChange}
            outputFormat={outputFormat}
            /> 
        )

        // Get inputs
        const dateInput = Wrapper.find(".date-input.date").first();
        
        // Sets results
        const dateChangeEvent = { target: { value: "20" } };
        dateInput.simulate("change", dateChangeEvent);
        
        // Compare based in moment.format()
        const testDateStr = results.value;
        const testDate = moment(testDateStr, outputFormat);
        const controlDate = moment().year(2005).month("Aug").date(20);

        // Compare results from state
        const compareFormat = "YYYY-MM-DD";
        expect(testDate.format(compareFormat))
        .toEqual(controlDate.format(compareFormat))
    })

    it("Should not allow later date than # of days in month", ()=>{
        // Stores all onChange results
        let results = "unchanged";
        // Sets results
        const handleChange = (changeResults)=>{ results = changeResults; }

        // Initialize wrapper
        const Wrapper = mount(
            <DateInput
            value="2005-01-01"
            onChange={handleChange}
            /> 
        )

        // Get inputs
        const dateInput = Wrapper.find(".date-input.date").first();
        const monthInput = Wrapper.find(".date-input.month").first();

        // Test max January date
        const janChangeInRange = { target: { value: "31" } };
        dateInput.simulate("change", janChangeInRange);
        expect(results.isValid)
        .toEqual(true);
        const janChangeOutRange = { target: { value: "32" } };
        dateInput.simulate("change", janChangeOutRange);
        expect(results.isValid)
        .toEqual(false);

        // Reset to first of month
        const resetDateChange = { target: { value: "01" } };
        dateInput.simulate("change", resetDateChange);

        // Test max November date
        // First, set month to November
        monthInput.simulate("change", {target: { value: "11"}})
        const dateStr = moment(results.value, "YYYY-MM-DD");
        expect(dateStr.format("MMM"))
        .toEqual("Nov")

        const novChangeInRange = { target: { value: "30" } };
        dateInput.simulate("change", novChangeInRange);
        expect(results.isValid)
        .toEqual(true);
        const novChangeOutRange = { target: { value: "31" } };
        dateInput.simulate("change", novChangeOutRange);
        expect(results.isValid)
        .toEqual(false);
    })

    it("Should respond to validateFunc", ()=>{
        let fakeValidated;
        const initalDateStr = "2005-04-02"
        // Stores all onChange results
        let results = "unchanged";
        // Sets results
        const handleChange = (changeResults)=>{ results = changeResults; }

        // Recieves moment object from state
        const validate = (momentObj)=>{
            expect(momentObj.format("YYYY-MM-DD"))
            .toEqual(initalDateStr)
            return fakeValidated;
        }
        
        // Initialize wrapper
        const Wrapper = mount(
            <DateInput
            value={initalDateStr}
            onChange={handleChange}
            validateFunc={validate}
            /> 
        )
        const dateInput = Wrapper.find(".date-input.date").first();

        // Start with invalid
        fakeValidated = false;
        dateInput.simulate("change", { target: { value: "02"} });
        expect(results.isValid)
        .toEqual(false)

        // Then make valid
        fakeValidated = true;
        dateInput.simulate("change", { target: { value: "02"} });
        expect(results.isValid)
       .toEqual(true)

    })
})