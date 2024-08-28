function phoneBillApp() {
    return {
        // Variables to hold data
        newPlan: { name: '', call_cost: '', sms_cost: '' },
        createStatus: '',
        pricePlans: [],
        selectedPlan: '',
        actions: '',
        totalBill: 0,
        url: 'https://phone-bill-api-idtm.onrender.com',  // Ensure the URL is defined as a property

        // Fetch all price plans
        fetchPricePlans() {
            fetch(`${this.url}/api/price_plans/`)
                .then(res => res.json())
                .then(data => {
                    this.pricePlans = data;
                })
                .catch(error => console.error('Error fetching price plans:', error));
        },

        // Create a new price plan
        createPricePlan() {
            if (!this.newPlan.name || !this.newPlan.call_cost || !this.newPlan.sms_cost) {
                console.error('All fields are required.');
                return;
            }
            fetch(`${this.url}/api/price_plan/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.newPlan)
            })
            .then(res => res.text())
            .then(data => {
                this.createStatus = data;
                this.newPlan = { name: '', call_cost: '', sms_cost: '' }; // Clear the form
                this.fetchPricePlans(); // Refresh the list of price plans
            })
            .catch(error => console.error('Error creating price plan:', error));
        },

        // Calculate phone bill
        calculatePhoneBill() {
            const billData = {
                price_plan: this.selectedPlan,
                actions: this.actions
            };
            fetch(`${this.url}/api/phonebill`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(billData)
            })
            .then(res => res.json())
            .then(data => {
                this.totalBill = data.total;
            })
            .catch(error => console.error('Error calculating phone bill:', error));
        }
    };
}
