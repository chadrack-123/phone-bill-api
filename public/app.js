function phoneBillApp() {
    return {
        // Variables to hold data
        newPlan: { name: '', call_cost: '', sms_cost: '' },
        createStatus: '',
        pricePlans: [],
        selectedPlan: '',
        actions: '',
        totalBill: 0,

        // Fetch all price plans
        fetchPricePlans() {
            fetch('https://phone-bill-api-idtm.onrender.com/api/price_plans/')
                .then(res => res.json())
                .then(data => {
                    this.pricePlans = data;
                }).catch(error => console.error('Error fetching price plans:', error));
        },

        // Create a new price plan
        createPricePlan() {
            fetch('/api/price_plan/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.newPlan)
            })
            .then(res => res.text())
            .then(data => {
                this.createStatus = data;
                this.newPlan = { name: '', call_cost: '', sms_cost: '' }; // Clear the form
                this.fetchPricePlans(); // Refresh the list of price plans
            });
        },

        // Calculate phone bill
        calculatePhoneBill() {
            const billData = {
                price_plan: this.selectedPlan,
                actions: this.actions
            };
            fetch('/api/phonebill', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(billData)
            })
            .then(res => res.json())
            .then(data => {
                this.totalBill = data.total;
            });
        }
    };
}
