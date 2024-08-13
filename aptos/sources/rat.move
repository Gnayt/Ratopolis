module Rat {
    struct Component has key {
        id: u64,
        owner: address,
        transferable: bool,
        image_url: string
    }

    struct Body has key {
        id: u64,
        owner: address,
        transferable: bool,
        components: vector<Component>
    }
    public fun mint(recipient: address, token_uri: string): U64 {
        // Generate a unique ID for the NFT
        let token_id = self.token_counter;
        self.token_counter = token_id + 1;

        // Create a new NFT with the specified token URI
        let nft = NFT {
            id: token_id,
            owner: recipient,
            token_uri: token_uri,
        };

        // Add the NFT to the recipient's collection
        self.nfts.add(recipient, nft);

        // Return the ID of the minted NFT
        token_id
    }
    public fun add_component(composite: &mut Body, component: Component) {
        assert!(composite.owner == component.owner, 0);
        composite.components.push_back(component);
    }

    public fun remove_component(composite: &mut Body, component_id: u64) {
        let index = composite.components.index_of(&component_id);
        if (index != -1) {
            let component = composite.components.remove(index);
            assert!(component.owner == composite.owner, 1);
            destroy_empty(component);
        }
    }

    public fun modify_component(composite: &mut Body, component_id: u64, new_owner: address, new_transferable: bool) {
        let index = composite.components.index_of(&component_id);
        if (index != -1) {
            let component = &mut composite.components[index];
            assert!(component.owner == composite.owner, 2);
            component.owner = new_owner;
            component.transferable = new_transferable;
        }
    }
}