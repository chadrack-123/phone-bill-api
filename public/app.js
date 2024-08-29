function phoneBillApp() {
    return {
        // Variables to hold data
        newPlan: { name: '', call_cost: '', sms_cost: '' },
        createStatus: '',
        editStatus: '',
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

        // Edit an existing price plan
        editPricePlan(plan) {
            // Convert the Proxy to a plain object
            const plainPlan = JSON.parse(JSON.stringify(plan));

            // // Assign the plain object to newPlan
            // this.newPlan = { ...plainPlan };

            this.newPlan = {
                name: plainPlan.plan_name,
                call_cost: plainPlan.call_price,
                sms_cost: plainPlan.sms_price,
                id: plainPlan.id // Keep the ID if you need it for updates
            };

            // Log the plain object for debugging
            console.log('Plain Plan Object:', plainPlan);

            // Use $nextTick to ensure the DOM updates correctly
            this.$nextTick(() => {
                console.log('New Plan Object after assignment:', this.newPlan);
            });
            
        },

        // Update the selected price plan
        updatePricePlan() {
            fetch(`${this.url}/api/price_plan/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.newPlan)
            })
            .then(res => res.text())
            .then(data => {
                this.editStatus = data;
                this.newPlan = { name: '', call_cost: '', sms_cost: '' }; // Clear the form
                this.fetchPricePlans(); // Refresh the list of price plans
            })
            .catch(error => console.error('Error updating price plan:', error));
        },

        // Cancel the edit operation
        cancelEdit() {
            this.newPlan = { name: '', call_cost: '', sms_cost: '' }; // Reset the form

        },

        // Delete a price plan
        deletePricePlan(planId) {
            if (confirm("Are you sure you want to delete this price plan?")) {
                fetch(`${this.url}/api/price_plan/delete`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: planId })
                })
                .then(res => res.text())
                .then(data => {
                    this.fetchPricePlans(); // Refresh the list of price plans
                })
                .catch(error => console.error('Error deleting price plan:', error));
            }
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
